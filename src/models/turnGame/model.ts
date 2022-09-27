/** Numerical values for win, loss, and draw. */
export enum TerminalValue {
  Win = 1,
  Loss = -1,
  Draw = 0
}

// TODO: replace getPastMoves with getState as function, and add StateType as type parameter.
// Currently, class is mutable and can cause problems. getState should represent
// an immutable object that encapsulates the entire state, including the players'
// terminal values. Additionally, for a large number of moves, this is more efficient
// than getPastMoves for representing game state.

/**
 * An interface for a turn based game model. The implementation must also
 * have a constructor that accepts an optional object instance of its own class,
 * where the newly created object must be a deep copy of the passed object.
 */
export interface TurnGameModel<MoveType> {
  /** Makes move for current player. Throws error if move is invalid. */
  makeMove: (move: MoveType) => void,

  /** Returns the move that was undone. Throws error if there were no moves. */
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
