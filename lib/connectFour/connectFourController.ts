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
  /*
  undoMove() {
    const move = this.game.undoMove();

    this.notifySubscribers();

    return {
      move,
      nextPlayer: this.game.getCurrentPlayer()
    };
  }
  */

  // Returns a 2d array of the connect four board. Array elements are 0 if piece
  // belongs to first player, 1 if piece belongs to second player, -1 if empty.
  getGrid() {
    // Init grid
    const _grid: Array<Array<number>> = [];
    for (let i = 0; i < ConnectFourBoard.NUM_COLS; ++i) _grid.push([]);
  
    // Push past moves into grid
    const pastMoves = this.game.getPastMoves();
    let player = 0;
  
    for (const move of pastMoves) {
      _grid[move].push(player);
      player = player ^ 1;
    }
  
    // Fill out rest of grid with -1
    for (const col of _grid) {
      for (let i = col.length; i < ConnectFourBoard.NUM_ROWS; ++i) {
        col.push(-1);
      }
    }
  
    return _grid;
  }
}
