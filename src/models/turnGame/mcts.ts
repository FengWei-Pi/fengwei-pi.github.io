import type { TurnGameModel } from "./board";

/**
 * Interface for a node of monte carlo tree search for two players.
 * @see https://en.wikipedia.org/wiki/Monte_Carlo_tree_search#Principle_of_operation for general principles.
 */
// For possible extension to three players, see https://deepai.org/publication/multiplayer-alphazero.
export interface MCTS<MoveType, GameType extends TurnGameModel<MoveType>> {
  /**
   * Completes a full monte carlo simulation, from selection, to expansion, evaluation,
   * and backpropagation. Returns the value of the current state for the previous player.
   * Uses the evaluate function provided in constructor. Uses the true value for terminal
   * node.
   */
  simulate: () => number;

  /** Returns the moves visited move from simulations. */
  getMostVisitedMove: () => MoveType;

  /**
   * Updates this node's member variables to be the member variables of the child node of the
   * provided move.
   */
  makeMove: (move: MoveType) => void;

  getState: () => GameType
}
