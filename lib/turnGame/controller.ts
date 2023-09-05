import { TerminalValue, TurnGameModel } from "./model";

type MoveMade<MoveType> = {
  move: MoveType,
  nextPlayer: number
}

export abstract class TurnGameController<MoveType, GameType extends TurnGameModel<MoveType>> {
  protected game: GameType;
  private subscribers: Array<(game: GameType) => void> = [];

  constructor(game: GameType) {
    this.game = game;
  }

  /** Adds a callback that is called every time the game's board state changes. */
  addSubscriber(cb: (game: GameType) => void) {
    this.subscribers.push(cb);
    return cb;
  }

  removeSubscriber(cb: (game: GameType) => void) {
    this.subscribers = this.subscribers.filter(subscriber => cb !== subscriber);
  }

  /**
   * Returns if the game ended. Returns 'win', 'loss', 'draw', or 'ongoing' for
   * the given player.
   */
  getEnd(player: number) {
    const terminalVal = this.game.getTerminalValue(player);
    if (terminalVal === null) return "ongoing";
    if (terminalVal === TerminalValue.Win) return "win";
    if (terminalVal === TerminalValue.Loss) return "loss";
    return "draw";
  }

  protected notifySubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.game);
    }
  }

  /**
   * Make a move for the current player. Returns the move that was made and the
   * player who has the next turn. If the current player is human, requires an input.
   */
  abstract makeMove(move: MoveType): Promise<MoveMade<MoveType>>;

  /**
   * Returns the move that was undone and the player who has the next turn.
   */
  abstract undoMove(move: MoveType): MoveMade<MoveType>;
}