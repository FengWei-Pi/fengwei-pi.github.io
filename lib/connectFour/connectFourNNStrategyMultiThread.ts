import { ConnectFourBoard } from "./connectFourBoard";
import { ConnectFourController } from "./connectFourController";
import { TurnGameComputerStrategy } from "../turnGame/computerStrategy";
import { Action, MessageResponse  } from "./connectFourNNStrategyWorkerTypes";
import type { ConnectFourMove } from "./connectFourBoard";
import type {
  GetMove,
  SetNumSimulations,
  UpdatePastMoves,
} from "./connectFourNNStrategyWorkerTypes";

/**
 * Non-UI blocking class for making Connect Four computer moves.
 */
export class ConnectFourNNStrategyMultiThread extends TurnGameComputerStrategy<
  ConnectFourMove,
  ConnectFourBoard
> {
  private worker = new Worker(new URL("./connectFourNNStrategyWorker.ts", import.meta.url));

  private notify(game: ConnectFourBoard) {
    const message : UpdatePastMoves = {
      action: Action.UpdatePastMoves,
      payload: game.getPastMoves()
    };

    this.worker.postMessage(message);
  }

  setController(controller: ConnectFourController) {
    if (this.controller) this.controller.removeSubscriber(this.notify);

    this.controller = controller;
    controller.addSubscriber(this.notify);
  }

  setNumSimulations(num: number) {
    if (num <= 0) throw new Error("Number of simulations must be greater than zero.");

    const message : SetNumSimulations = {
      action: Action.SetNumSimulations,
      payload: num
    };

    this.worker.postMessage(message);
  }

  async getMove(game: ConnectFourBoard) {
    return new Promise<number>(resolve => {
      const message : GetMove = {
        action: Action.GetMove,
        payload: game.getPastMoves()
      };
      
      this.worker.postMessage(message);

      this.worker.onmessage = (e => {
        const message = e.data as MessageResponse;
        resolve(message.payload);

        this.worker.onmessage = null;
      });
    });
  }
}