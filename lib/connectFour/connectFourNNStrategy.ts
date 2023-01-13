import { ConnectFourBoard } from "./connectFourBoard";
import { ConnectFourController } from "./connectFourController";
import { ConnectFourNeuralNet } from "./connectFourNeuralNet";
import { MCTS_Node_NN } from "../turnGame/mcts_nn";
import { TurnGameComputerStrategy } from "../turnGame/computerStrategy";
import { TurnGameNeuralNet } from "../turnGame/neuralNet";
import modelJSON from "./model.json";
import type { ConnectFourMove } from "./connectFourBoard";

export class ConnectFourNNStrategy extends TurnGameComputerStrategy<ConnectFourMove, ConnectFourBoard> {
  private node?: MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>;
  private numSimulations = 50;

  /** Updates the internal mcts node to match the provided game state.*/
  private notify(game: ConnectFourBoard) {
    if (this.node === undefined) return;

    // If the provided game is only a single move ahead of this.node's game,
    // make the move. Otherwise, clear this.node.
    const moves = game.getPastMoves();
    const nodeMoves = this.node.getState().getPastMoves();

    if (moves.length <= 0 || moves.length !== nodeMoves.length) {
      this.node = undefined;
      return;
    }

    const lastMove = moves.pop() as number;
    let samePastMoves = true;
    
    for (let i=0; i<moves.length; ++i) {
      if (moves[i] !== nodeMoves[i]) {
        samePastMoves = false;
        break;
      }
    }

    if (!samePastMoves) {
      this.node = undefined;
      return;
    }

    // There's only one move difference. Make the move for this.node.
    this.node.makeMove(lastMove);
  }

  setController(controller: ConnectFourController) {
    if (this.controller) this.controller.removeSubscriber(this.notify);

    this.controller = controller;
    controller.addSubscriber(this.notify);
  }

  setNumSimulations(num: number) {
    if (num <= 0) throw new Error("Number of simulations must be greater than zero.");
    this.numSimulations = num;
  }

  async getMove(game: ConnectFourBoard) {
    // If this.node does not match provided game state, create a new node.
    if (!this.node || this.node.getState().getPastMoves() !== game.getPastMoves()) {
      const net = await TurnGameNeuralNet.build(ConnectFourNeuralNet, modelJSON);

      this.node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
        new ConnectFourBoard(game),
        ConnectFourBoard,
        net,
      );
    }

    for (let i=0; i<this.numSimulations; ++i) {
      this.node.simulate();
    }

    return this.node.getMostVisitedMove();
  }
}