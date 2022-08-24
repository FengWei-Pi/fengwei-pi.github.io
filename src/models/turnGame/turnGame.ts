/** Numerical values for win, loss, and draw. */
export enum TerminalValue {
  WIN = 1,
  LOSS = -1,
  DRAW = 0
}

/** An interface for a turn based game model. */
export type TurnGameBoard<MoveType> = {
  /** Replacement for copy constructor. */
  clone: () => TurnGameBoard<MoveType>,

  /** Makes move for current player. Throws error if move is invalid. */
  makeMove: (move: MoveType) => void,

  /** Throws error if there are no moves. */
  undoMove: (move: MoveType) => void,

  isValidMove: (move: MoveType) => boolean,

  /** Returns the player that has the current move. Player index starts at 0. */
  getCurrentPlayer: () => number,
  
  /**
   * Returns the terminal value for the given player. Returns null if game has not
   * ended yet.
   */
  getTerminalValue: (player: number) => TerminalValue | null,
 
  getValidMoves: () => Array<MoveType>,

  /**
   * Returns the sequence of all moves played, starting with player 0 and continuing
   * sequentially. This should completely encapsulates the current state of the game,
   * including the current turn's player, the possible moves, whether a player has won,
   * etc.
   */
  getPastMoves: () => Array<MoveType>,
}
