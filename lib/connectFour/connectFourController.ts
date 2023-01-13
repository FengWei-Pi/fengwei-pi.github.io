import { TurnGameController } from "../turnGame/controller";
import { ConnectFourBoard, ConnectFourMove } from "./connectFourBoard";
import type { TurnGameComputerStrategy } from "../turnGame/computerStrategy";

/**
 * Class for playing connect four games between two players. Either or both players
 * can be human (require input) or computer.
 */
export class ConnectFourController extends TurnGameController<ConnectFourMove, ConnectFourBoard> {
  private strategies: [
    TurnGameComputerStrategy<ConnectFourMove, ConnectFourBoard> | null,
    TurnGameComputerStrategy<ConnectFourMove, ConnectFourBoard> | null
  ];

  /** Set an argument to null to require input for that player move. */
  constructor(
    computerStrategy1: TurnGameComputerStrategy<ConnectFourMove, ConnectFourBoard> | null,
    computerStrategy2: TurnGameComputerStrategy<ConnectFourMove, ConnectFourBoard> | null
  ) {
    super(new ConnectFourBoard());
    this.strategies = [computerStrategy1, computerStrategy2];
  }

  /**
   * Make a move for the current player. Returns the move that was made and the
   * player who has the next turn. Requires an input if player is human.
   */
  async makeMove(move?: ConnectFourMove) {
    const strategy = this.strategies[this.game.getCurrentPlayer()];

    if (strategy === null) {
      if (move === undefined) throw new Error("Move input required");
      this.game.makeMove(move);
    } else {
      move = await strategy.getMove(this.game);
      this.game.makeMove(move);
    }
    
    this.notifySubscribers();
    
    return {
      move,
      nextPlayer: this.game.getCurrentPlayer()
    };
  }

  /** Returns the move that was undone and the player who has the next turn. */
  undoMove() {
    const move = this.game.undoMove();

    this.notifySubscribers();

    return {
      move,
      nextPlayer: this.game.getCurrentPlayer()
    };
  }
}