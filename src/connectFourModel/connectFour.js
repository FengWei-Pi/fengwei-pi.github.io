import BitSet from "bitset";

// Bitboards based off https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md
export default class ConnectFour {
  // Create new empty connect four game with players zero and one.
  // Player zero moves first.
  constructor(connectFour) {
    if (!connectFour) {
      this.bitboards = [new BitSet(), new BitSet()];

      this.heights = [0, 7, 14, 21, 28, 35, 42];
      this.numMoves = 0;
      this.moves = []; // Stores column indexes of moves for the entire game
    } else {
      this.bitboards = [new BitSet(connectFour.bitboards[0]), new BitSet(connectFour.bitboards[1])];

      this.heights = [...connectFour.heights];
      this.numMoves = connectFour.numMoves;
      this.moves = [...connectFour.moves];
    }
  }

  // Returns 0 or 1
  getCurrentPlayer() {
    return this.numMoves & 1;
  }
  // Returns 0 or 1
  getLastPlayer() {
    return (this.numMoves & 1) ^ 1;
  }

  // Makes a move for the current player
  makeMove(col) {
    const move = new BitSet([this.heights[col]++]);
    this.bitboards[this.numMoves & 1] = move.xor(this.bitboards[this.numMoves & 1]);
    this.moves.push(col);
    ++this.numMoves;
  }

  // Undo's last move
  undoMove() {
    --this.numMoves;
    const col = this.moves.pop();
    const move = new BitSet([--this.heights[col]]);
    this.bitboards[this.numMoves & 1] = move.xor(this.bitboards[this.numMoves & 1]);
  }

  // TODO: store terminal state as member variable (ex. 0 for draw, 1 for first player winning, -1 for second player winning,
  // null for not terminal, undefined for not yet accessed), make MCTS use this instead of isTerminal logic
  
  // Returns true if the player who made the last move has won
  hasWon() {
    const bitboard = this.bitboards[this.getLastPlayer()];
    if (!bitboard.and(bitboard.slice(6)).and(bitboard.slice(12)).and(bitboard.slice(18)).equals(0))return true; // diagonal \
    if (!bitboard.and(bitboard.slice(8)).and(bitboard.slice(16)).and(bitboard.slice(24)).equals(0)) return true; // diagonal /
    if (!bitboard.and(bitboard.slice(7)).and(bitboard.slice(14)).and(bitboard.slice(21)).equals(0)) return true; // horizontal
    if (!bitboard.and(bitboard.slice(1)).and(bitboard.slice(2)).and(bitboard.slice(3)).equals(0)) return true; // vertical
    return false;
  }

  // Returns true if game board is full and no more moves can be made
  isFull() {
    return this.numMoves >= 42;
  }

  // Returns an array with the column indexes of valid moves
  getValidMoves() {
    const moves = [];

    const TOP = new BitSet("1000000100000010000001000000100000010000001000000");
    this.heights.forEach((height, index) => {
      if (TOP.get(height) === 0) moves.push(index);
    });
    return moves;
  }

  // Returns an array of coordinates of currently placed player pieces. A coordinate is an
  // array with three numbers, the column index, row index, and player index, in that order.
  // (0, 0) is bottom left.
  //
  // ex. Let boards be the returned value from this function. Then,
  // boards[i] is the coordinates for piece i, boards[i][0] is the column index, boards[i][1]
  // is the row index, and boards[i][2] is the player index.
  getPieces() {
    const pieces = [
      ...this.bitboards[0].toArray().map(ind => [Math.floor(ind / 7), ind % 7, 0]),
      ...this.bitboards[1].toArray().map(ind => [Math.floor(ind / 7), ind % 7, 1])
    ];
    return pieces;
  }

  // Returns a 2d array representing the board. An element is -1 if it's empty, 0 if it
  // contains a piece from player 0, 1 if it contains a piece from player 1. The first
  // index is the col, the second is the row. (0, 0) is the bottom left cell.
  getBoard() {
    const grid = [[], [], [], [], [], [], []];
    
    for (let i=0; i<49; ++i) {
      if (i % 7 === 6) continue;
      if (this.bitboards[1].get(i) === 1) {
        grid[Math.floor(i / 7)][i % 7] = 1;
      } else {
        grid[Math.floor(i / 7)][i % 7] = this.bitboards[0].get(i) - 1;
      }
    }

    return grid;
  }
}