import BitSet from "bitset";
import { TerminalValue, TurnGameModel } from "../turnGame/model";

export type ConnectFourMove = number;

// Bitboards based off https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md
/**
 * Class representing connect four board with efficient operations.
 * 
 * @see https://en.wikipedia.org/wiki/Connect_Four#Gameplay for rules.
 */
export class ConnectFourBoard implements TurnGameModel<ConnectFourMove> {
  static NUM_ROWS = 6;
  static NUM_COLS = 7;

  private bitboards: [BitSet, BitSet];
  private heights: [number, number, number, number, number, number, number];
  private numMoves: number;
  private moves: Array<ConnectFourMove>;

  // Create new empty connect four game with players zero and one.
  // Player zero moves first.
  constructor(connectFour? : ConnectFourBoard) {
    if (connectFour === undefined) {
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

  makeMove(col) {
    if (!this.isValidMove(col)) throw new Error("Making invalid move");

    const move = new BitSet([this.heights[col]++]);
    this.bitboards[this.numMoves & 1] = move.xor(this.bitboards[this.numMoves & 1]);
    this.moves.push(col);
    ++this.numMoves;
  }

  undoMove() {
    if (this.numMoves <= 0) throw new Error("Undoing move of game with no moves");

    --this.numMoves;
    const col = this.moves.pop()!;
    const move = new BitSet([--this.heights[col]]);
    this.bitboards[this.numMoves & 1] = move.xor(this.bitboards[this.numMoves & 1]);

    return col;
  }

  // Returns true if the game is full and no more moves can be made
  private isFull() {
    return this.numMoves >= 42;
  }
  
  isValidMove(move: number) {
    if (move < 0 || move >= ConnectFourBoard.NUM_COLS) return false;

    const TOP = new BitSet("1000000100000010000001000000100000010000001000000");
    if (TOP.get(this.heights[move]) === 0) return true;

    return false;
  }

  getTerminalValue(player: number) {
    if (player !== 0 && player !== 1) throw new RangeError("Getting terminal value of invalid player");

    const bitboard = this.bitboards[this.getCurrentPlayer() ^ 1];
    const bitsetZero = new BitSet(0);

    // Whether previous player has won
    let hasWon = false;

    if (
      // Checks if four pieces are connected in diagonal \
      !bitboard.and(bitboard.slice(6)).and(bitboard.slice(12)).and(bitboard.slice(18)).equals(bitsetZero) ||
      // diagonal /
      !bitboard.and(bitboard.slice(8)).and(bitboard.slice(16)).and(bitboard.slice(24)).equals(bitsetZero) ||
      // horizontal
      !bitboard.and(bitboard.slice(7)).and(bitboard.slice(14)).and(bitboard.slice(21)).equals(bitsetZero) ||
      // vertical
      !bitboard.and(bitboard.slice(1)).and(bitboard.slice(2)).and(bitboard.slice(3)).equals(bitsetZero)
    ) {
      hasWon = true;
    }

    // If there's no winner and game is not full, return game is ongoing.
    // Otherwise, there's no winner and game is full, return draw.
    if (!hasWon) {
      if (!this.isFull()) return null;
      return TerminalValue.Draw;
    }

    // If the given player is the current player, return loss
    if (this.getCurrentPlayer() === player) return TerminalValue.Loss;
    // If the given player is the previous player, return win
    else return TerminalValue.Win;
  }

  getValidMoves() {
    const moves : Array<number> = [];

    const TOP = new BitSet("1000000100000010000001000000100000010000001000000");
    this.heights.forEach((height, index) => {
      if (TOP.get(height) === 0) moves.push(index);
    });
    return moves;
  }

  getPastMoves() {
    return [...this.moves];
  }
}