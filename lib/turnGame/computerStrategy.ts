import type { TurnGameController } from "./controller";
import type { TurnGameModel } from "./model";

import type { Analysis } from "./mcts_nn";
export type { Analysis };

export abstract class TurnGameComputerStrategy<
  MoveType,
  GameType extends TurnGameModel<MoveType>
> {
  protected controller?: TurnGameController<MoveType, GameType>;

  setController(controller: TurnGameController<MoveType, GameType>) {
    this.controller = controller;
  }

  abstract getMove(game: GameType): Promise<MoveType>;
}
