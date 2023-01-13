/*
 * Running this test (and any other test using tfjs) will show errors in the console
 * saying HTMLCanvasElement not implemented. This is because tfjs will try to load
 * webGL backend used for browsers and fail. Tests will still work since tfjs will
 * fallback to cpu backend.
 * 
 * See https://github.com/tensorflow/tfjs/issues/540 for more information.
 */

import { MCTS_Node_NN } from "./mcts_nn";
import { TurnGameNeuralNet } from "./neuralNet";
import { ConnectFourBoard } from "../connectFour/connectFourBoard";
import { ConnectFourNeuralNet } from "../connectFour/connectFourNeuralNet";
import modelJson from "../connectFour/model.json";
import type { ConnectFourMove } from "../connectFour/connectFourBoard";

const mockNeuralNet : jest.Mocked<ConnectFourNeuralNet> = {
  // @ts-expect-error private members are required to be mocked, even though they shouldn't be.
  // Problem with typescript and jest.
  model: null,
  getInputTensorsFromBitboards: jest.fn(),
  predict: jest.fn(),
  getModel: jest.fn(),
  getModelStr: jest.fn()
};

describe("New node", () => {
  test("Should get state", async () => {
    const board = new ConnectFourBoard();

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard,
      mockNeuralNet
    );

    expect(node.getState()).toBe(board);
  });
  
  test("Should simulate", async () => {
    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      new ConnectFourBoard(),
      ConnectFourBoard,
      mockNeuralNet
    );
    
    mockNeuralNet.predict.mockImplementationOnce(() => {
      const priors = new Map([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0]
      ]);

      return { priors, value: 0.5 };
    });

    expect(node.simulate()).toBe(-0.5);
  });

  test("Should get most visited move", async () => {
    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      new ConnectFourBoard(),
      ConnectFourBoard,
      mockNeuralNet
    );

    mockNeuralNet.predict.mockImplementation(() => {
      const priors = new Map([
        [0, 0],
        [1, 0],
        [2, 1],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0]
      ]);

      return { priors, value: 0.5 };
    });

    for (let i=0; i<10; ++i) {
      node.simulate();
    }

    expect(node.getMostVisitedMove()).toBe(2);
  });

  test("Should make move", () => {
    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      new ConnectFourBoard(),
      ConnectFourBoard,
      mockNeuralNet
    );
    
    mockNeuralNet.predict.mockImplementation(() => {
      const priors = new Map([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0]
      ]);

      return { priors, value: 1 };
    });

    node.simulate();
    node.makeMove(3);
    const connectFourBoard = node.getState();

    expect(connectFourBoard.getCurrentPlayer()).toBe(1);
    expect(connectFourBoard.getPastMoves()).toEqual([3]);
  });
});

describe("Node with provided Connect Four board", () => {
  const network = TurnGameNeuralNet.build(ConnectFourNeuralNet, modelJson);

  test("Should win in one move", async () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(4);
    board.makeMove(3);
    board.makeMove(5);
    board.makeMove(3);
    board.makeMove(2);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard,
      await network
    );

    for (let i=0; i<50; ++i) {
      node.simulate();
    }

    expect(node.getMostVisitedMove()).toBe(3);
  });

  test("Should prevent loss in one move", async () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(4);
    board.makeMove(3);
    board.makeMove(5);
    board.makeMove(3);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard,
      await network
    );

    for (let i=0; i<50; ++i) {
      node.simulate();
    }

    expect(node.getMostVisitedMove()).toBe(3);
  });

  test("Should win in two moves", async () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(3);
    board.makeMove(4);
    board.makeMove(3);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard,
      await network
    );

    for (let i=0; i<50; ++i) {
      node.simulate();
    }

    expect([2, 5]).toContain(node.getMostVisitedMove());
  });

  test("Should prevent loss in two move", async () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(3);
    board.makeMove(4);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard,
      await network
    );
    
    for (let i=0; i<50; ++i) {
      node.simulate();
    }

    expect([2, 5]).toContain(node.getMostVisitedMove());
  });
});
