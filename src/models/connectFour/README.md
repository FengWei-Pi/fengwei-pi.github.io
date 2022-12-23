This folder contains the Connect Four AI agent for playing the game, based on AlphaGo Zero. It does not include the code for training the neural network; an already trained model is stored in `model.json`.

See https://www.deepmind.com/blog/alphago-zero-starting-from-scratch for more information about training the neural network and AlphaGo Zero, the research that this project is based on.  
See https://medium.com/oracledevs/lessons-from-implementing-alphazero-7e36e9054191 for an excellent article series about translating AlphaGo Zero to Connect Four.  
See https://medium.com/applied-data-science/how-to-build-your-own-alphazero-ai-using-python-and-keras-7f664945c188 for a guide on implementing the AI for connect four in code using Python and Keras.

# Content
1. [Implementation](#implementation)
2. [Connect Four Board](#connect-four-board)
3. [Neural Network Architecture](#neural-network-architecture)
4. [Connect Four Neural Net](#connect-four-neural-net)
5. [Monte Carlo Tree Search](#monte-carlo-tree-search)
6. [Connect Four Strategy](#connect-four-strategy)
7. [Connect Four Controller](#connect-four-controller)
8. [Improvements](#improvements)

# Implementation

The AI needs three conceptual components, the game model, a neural network, and a search algorithm. The specific implementations can vary wildly, so this document explains how it's being done here. Requires knowledge of how AlphaGo Zero works.

The implementation code is in this folder, while the type definitions are in [models/turnGame folder](../turnGame/), using TypeScript to follow an object-oriented approach and Tensorflow.js for the neural network.

# Connect Four Board

The [ConnectFourBoard](./connectFourBoard.ts) class represents the game model for connect four, based on a bitboard implementation of Connect Four in [this guide](https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md).

`ConnectFourBoard` implements the `TurnGameModel` interface found in [turnGame/model.ts](../turnGame/model.ts). This is done because the techniques used here work for any multi-player, turn-based game of perfect information. The other components, the search algorithm and neural network, could then depend on any valid `TurnGameModel`.

A `TurnGameModel` includes basic operations such as making a move, undoing a move, checking if the game has ended, and determining the results (win, loss, or draw). It can return a history of the moves made, which is sufficient to determine the current game state.

`TurnGameModel` accepts a type parameter `MoveType`, and a class that extends `TurnGameModel` should provide a concrete `MoveType` as a way to provide the return type of some of its methods.

# Neural Network Architecture

The architecture of the neural network was reached through trial and error over multiple iterations, with a goal of making it small enough so it reached a good playing level within 1-2 days.

The architecture looks like
```
   input                         input
   7x6x3                           7
     |                             ---------------------------
     v                                                       |
2d convolution                                               |
1 padding, 4 kernel size,                                    |
256 filters, 1 stride                                        |
     |                                                       |
     v                                                       |
batch normalization                                          |
     |                                                       |
     v                                                       |
    relu -------------------                                 |
     |                     |                                 |
     v                     |                                 |
2d convolution             |                                 |
1 padding, 3 kernel size,  |                                 |
256 filters, 1 stride      |                                 |
     |                     |                                 |
     v                     |                                 |
batch normalization        |                                 |
     |                     |                                 |
     v                     |                                 |
    relu                   |                                 |
     |                     |                                 |
     v                     |                                 |
2d convolution             |                                 |
1 padding, 3 kernel size,  |                                 |
256 filters, 1 stride      |                                 |
     |                     |                                 |
     v                     |                                 |
batch normalization        |                                 |
     |                     |                                 |
     v                     |                                 |
    add <-------------------                                 |
     |                                                       |
     v                                                       |
    relu                                                     |
     |---------------------------------                      |
     |                                |                      |
     v                                v                      |
2d convolution                   2d convolution              |  
1 kernel size, 16 filters,       1 kernel size, 16 filters,  |
1 stride                         1 stride                    |
     |                                |                      |
     v                                v                      |
batch normalization               batch normalization        |  
     |                                |                      |
     v                                v                      |
    relu                             relu                    |
     |                                |                      |
     v                                v                      |
   flatten                          flatten                  |
     |                                |                      |
     v                                v                      |
  dense relu                        dense                    |
    256                               7                      |
     |                                |                      |
     v                                v                      |
  dense tanh                       minimum <-----------------|
     1                                |
 (value head)                         v
                                   softmax
                                 (policy head)
```

L2 regularization with coefficient of `0.0001` is used everywhere it applies.

## Inputs

The network has two inputs. The 7x6x3 input encodes the game state, and has two 7x6 slices for each player's pieces (connect four is 7x6). An input number is 1 is a piece exists for the player, 0 otherwise. The third 7x6 slice is all 0's if it's the first player's turn, all 1's if it's the second's.

The 7 input encodes valid moves. An input number is 1 if the corresponding column is not yet full, and 0 otherwise.

## Convolution

The game state input if fed through a series of convolutional layers, batch nomalization, and relu activation. The first convolutional layer output size is 6x5(x number of filters), while the rest are 5x4.

Most noteworthy is the skip connection that feeds the output of the first relu into the relu layer before the output heads, done by the `add` layer.

## Outputs

The network has two outputs, a prior probability over all valid moves (policy head), and the value of the game state for the current player (value head). The 7 input is used as a mask to zero out invalid moves, done by the `minimum` layer.

## Code

For the exact code that was used to create a new network using Tensorflow.js, see
<details>
  <summary>Getting New Model</summary>

  ```
  import * as tf from '@tensorflow/tfjs';

  export function getNewModel() {
    return tf.tidy(() => {
      const regularizer = tf.regularizers.l2({ l2: 0.0001 });

      const input1 = tf.input({ shape: [7, 6, 3] });
      const padding = tf.layers.zeroPadding2d({ padding: 1 }).apply(input1);

      const input2 = tf.input({ shape: [7] });

      // Convolutional layer
      const convolution1 = tf.layers.conv2d({
        kernelSize: 4,
        filters: 256,
        strides: 1,
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer
      }).apply(padding);
      const batchNorm1 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution1);
      const relu1 = tf.layers.reLU().apply(batchNorm1);

      // Residual block
      const convolution2 = tf.layers.conv2d({
        kernelSize: 3,
        filters: 256,
        strides: 1,
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer,
        padding: 'same'
      }).apply(relu1);
      const batchNorm2 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution2);
      const relu2 = tf.layers.reLU().apply(batchNorm2);

      const convolution3 = tf.layers.conv2d({
        kernelSize: 3,
        filters: 256,
        strides: 1,
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer,
        padding: 'same'
      }).apply(relu2);
      const batchNorm3 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution3);

      const add1 = tf.layers.add().apply([relu1, batchNorm3]);
      const relu3 = tf.layers.reLU().apply(add1);

      // Policy head
      const convolution4 = tf.layers.conv2d({
        kernelSize: 1,
        filters: 16,	
        strides: 1,
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer
      }).apply(relu3);
      const batchNorm4 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution4);
      const relu4 = tf.layers.reLU().apply(batchNorm4);

      const flatten1 = tf.layers.flatten().apply(relu4);

      const probLogits = tf.layers.dense({
        units: 7,
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer
      }).apply(flatten1);

      const maskedLogits = tf.layers.minimum().apply([probLogits, input2]);
      const probabilities = tf.layers.softmax().apply(maskedLogits);

      // Value head
      const convolution5 = tf.layers.conv2d({
        kernelSize: 1,
        filters: 16,
        strides: 1,
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer
      }).apply(relu3);
      const batchNorm5 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution5);
      const relu5 = tf.layers.reLU().apply(batchNorm5);

      const flatten2 = tf.layers.flatten().apply(relu5);

      const dense2 = tf.layers.dense({
        units: 256,
        activation: 'relu',
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer
      }).apply(flatten2);

      const value = tf.layers.dense({
        units: 1,
        activation: 'tanh',
        kernelRegularizer: regularizer,
        biasRegularizer: regularizer
      }).apply(dense2);

      const model = tf.model({ inputs: [input1, input2], outputs: [probabilities, value] });
      return model;
    }) // tf.tidy
  }
  ```
</details>

## Training

Training was similarly done using trial and error using different hyperparameters. I don't recall the exact details, but it was roughly done over 16 hours. Several thousand games were played over around 16 iterations. Here, an iteration describes one game generation step plus one training step, sequentially done.

Many more games were generated at earlier iterations with a lower number of monte carlo tree search simulations, while fewer games were played as training progressed but with a higher number of simulations, ranging from 15-100 simulations per move and 800-200 games per game generation step in an iteration.

The training data was stored over the last 10 iterations. Each board state was stored as an input. For a board state, the number of visits to every move in the Monte Carlo Tree Search was converted to probabilities and used as the target output of the policy head. The final outcome of the game was used as the target output for the value head (-1 loss, 0 draw, 1 win).

Training used the Adam Optimizer with softmax cross-entropy loss for the policy head and mean squared error for the value head. A single training step passed through the entire training data twice (2 epochs) with a batch size of 32.

Roughly an equal amount of time was dedicated to generating games and training the network.

# Connect Four Neural Net

The trained network for connect four is stored in `model.json`, using [getSerializedModel() in turnGame/neuralNet.ts](../turnGame/neuralNet.ts) to convert it into a string.

The class [ConnectFourNeuralNet](./connectFourNeuralNet.ts) implements the `TurnGameNeuralNet` abstract class defined in [turnGame/neuralNet.ts](../turnGame/neuralNet.ts). A `TurnGameNeuralNet` represents a trained network and has methods for getting the output of the network from a given input, as well as serializing and deserializing the network.

To instantiate a new `connectFourNeuralNet` object with a serialized network string, the async deserialization must be performed, so the static method `build` in `TurnGameNeuralNet` is used instead of the constructor directly, following the [builder pattern](https://stackoverflow.com/a/43433773/20362635).

`TurnGameNeuralNet` accepts a `TurnGameType` type parameter with a concrete `MoveType`. A class that extends `TurnGameNeuralNet` should provide a concrete type to bind the neural network to a specific game.

# Monte Carlo Tree Search

[MCTS](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) is required for generating training data and playing the game.

The class `MCTS_Node_NN` implements the `MCTS_Node` interface. `MCTS_Node_NN` represents a single MCTS node that works with a neural network and has methods for selection, simulation, and backpropagation. It is generic and takes in any `TurnGameModel` and corresponding `TurnGameNeuralNet`.

# Connect Four Strategy

The class `ConnectFourNNStrategy` implements the `TurnGameComputerStrategy` interface. A `TurnGameComputerStrategy` follows the [strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern) and represents a specific strategy to make a move for given a game state.

`ConnectFourNNStrategy` is the strategy for making a connect four move with a neural network. Getting a move with `ConnectFourNNStrategy` is blocking, so the `ConnectFourNNStrategyMultiThread` class is implemented to offload the work to a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

Both concrete strategy classes subscribe to its controller and is notified whenever the game state in the controller changes. This is done because after a move is made, the already searched nodes can be kept while the rest are pruned.

# Connect Four Controller

The class `ConnectFourController` implements the `TurnGameController` interface. `ConnectFourController` accepts any combination of computer strategies and human players as constructor input. It coordinates the overall game between the players and is the intended class to be used when a new user-facing game is needed.

It follows the [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) and sends notifications whenever a move is made. Alternatively, the game state can be retrieved directly with `getGame`.

# Improvements

- Longer memory: Store more training data from past iterations. [MuZero](https://www.deepmind.com/blog/muzero-mastering-go-chess-shogi-and-atari-without-rules) stores millions of past data, more than AlphaZero. My network also performed better when it trained from more data in the past. Even though earlier data should be lower quality, training on it could help the network not forget its learnings.
- Server: Adding a server is the next intuitive choice, moving the network, search, and game model logic from the client to the server. This offloads the computation to the server and removes need for web workers, which is used currently. Additionally, training the network could also be done on a server.
- Python: Python is the standard choice for AI with an established ecosystem. Having the server run python would be the obvious choice over other languages.
- Database for training data: Storing a large amount of training data on a database is a perfect use case.