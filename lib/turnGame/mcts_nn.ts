import PD from "probability-distributions";

import { TurnGameNeuralNet } from "./neuralNet";
import { TerminalValue } from "./model";
import type { TurnGameModel } from "./model";
import type { MCTS_Node } from "./mcts";

type Action<MoveType, GameType extends TurnGameModel<MoveType>> = {
  node: MCTS_Node_NN<MoveType, GameType>,
  numChosen: number,
  avgValue: number,
  priorProb: number
};

/**
 * Node for Monte Carlo Tree Search adapted to use neural network evaluation,
 * taken from AlphaGo Zero paper
 * https://www.deepmind.com/blog/alphago-zero-starting-from-scratch.
 * 
 * In order to create a new node, the generic type arguments must be passed.
 * 
 * @example
 * const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
 *   new ConnectFourBoard(),
 *   ConnectFourBoard
 * )
 * 
 */
export class MCTS_Node_NN<MoveType, GameType extends TurnGameModel<MoveType>> implements MCTS_Node<MoveType, GameType> {
  // Controls how much value to place on exploration. Higher value means more
  // nodes are expanded that don't have the highest action value.
  /**
   * Constant that scales the upper confidence bound of the action value.
   * @see https://medium.com/oracledevs/lessons-from-alphazero-part-3-parameter-tweaking-4dceb78ed1e5#8e97
   */
  private static explorationConstant = 1;

  // Controls noise added to priors. Values less than 1 favors one random prior,
  // values greater than 1 flattens the prior distribution.
  /**
   * Alpha parameter of Dirichlet distribution. Values drawn from dirichlet distribution
   * are added to priors of action values.
   * 
   * @see https://medium.com/oracledevs/lessons-from-alphazero-part-3-parameter-tweaking-4dceb78ed1e5#9847
   */
  private static dirichletAlpha = 0.8;

  /**
   * The percent that a value from dirichlet distribution is added to prior.
   * @see x value in https://medium.com/oracledevs/lessons-from-alphazero-part-3-parameter-tweaking-4dceb78ed1e5#811a
   */
  private static noisePercent = 0.2;

  private state: GameType;
  private ctor: new (state: GameType) => GameType;
  private actions: Map<MoveType, Action<MoveType, GameType>> = new Map();
  private actionsChosenTotal = 0;
  private network: TurnGameNeuralNet<MoveType, GameType>;

  // Undefined if terminal value hasn't been checked yet. Null if game is not terminal.
  // Number if game is terminal.
  private terminalValue: number | null | undefined;
	
  constructor(
    state: GameType,
    ctor: new (state: GameType) => GameType,
    network: TurnGameNeuralNet<MoveType, GameType>
  ) {
    this.state = state;
    this.ctor = ctor;
    this.network = network;
  }

  /**
   * Selection step in monte carlo tree search. Returns the best action to select based
   * on the prior and upper confidence bound.
   */
  private selectAction() {
    let bestValue;
    let bestAction;

    this.actions.forEach(action => {
      const value = action.avgValue + action.priorProb *
        MCTS_Node_NN.explorationConstant *
        Math.sqrt(this.actionsChosenTotal) /
        (1 + action.numChosen);

      if (bestValue === undefined || value > bestValue) {
        bestValue = value;
        bestAction = action;
      }
    });

    return bestAction;
  }

  /** Initialize actions from evaluation of current state and valid moves. */
  private expand() {
    const { priors, value } =this.network.predict(this.state);

    const validMoves = this.state.getValidMoves();

    // npm package probability-distributions doesn't have dirichlet distribution directly,
    // so we use the gamma distribution to get a vector of dirichlet distribution values
    // instead, which is exactly what we need
    const noise: Array<number> = PD.rgamma(validMoves.length, MCTS_Node_NN.dirichletAlpha, 1);
    const totalNoise = noise.reduce((a, b) => a + b, 0);

    let totalProb = 1;
    if (validMoves.length < 7) {
      totalProb = 0;
      validMoves.forEach(move => {
        totalProb += priors.get(move) || 0;
      });
    }

    validMoves.forEach((move, index) => {
      const child = new MCTS_Node_NN<MoveType, GameType>(
        new this.ctor(this.state),
        this.ctor,
        this.network
      );
      child.state.makeMove(move);

      this.actions.set(move, {
        node: child,
        numChosen: 0,
        avgValue: 0,
        priorProb: (priors.get(move) || 0) / totalProb * (1-MCTS_Node_NN.noisePercent) +
          noise[index]/totalNoise * MCTS_Node_NN.noisePercent,
      });
    });

    return value;
  }

  getMostVisitedMove() {
    if (this.actions.size === 0) throw new Error(
      `Getting most visited move of MCTS node with no moves.
      Node most likely has not undergone any simulations.`
    );
    
    let bestMove: MoveType;
    let bestAction: Action<MoveType, GameType> | undefined;

    this.actions.forEach((action, move) => {
      bestAction = this.actions.get(bestMove);
      if (bestMove === undefined || (bestAction && action.numChosen > bestAction.numChosen)) {
        bestMove = move;
      }
    });

    return bestMove!;
  }

  makeMove(move: MoveType) {
    const action = this.actions.get(move);

    if (action === undefined) throw new Error("Move not found");

    this.state = action.node.state;
    this.actions = action.node.actions;
    this.actionsChosenTotal = action.node.actionsChosenTotal;
    this.terminalValue = action.node.terminalValue;
  }

  simulate() {
    if (this.terminalValue === undefined) {
      // Using true value for terminal value. Another option is to use the value
      // from the evaluate function.
      const terminalValue = this.state.getTerminalValue(this.state.getCurrentPlayer());

      if (terminalValue === TerminalValue.Loss) {
        this.terminalValue = -1;
      } else if (terminalValue === TerminalValue.Win) {
        this.terminalValue = 0;
      } else {
        this.terminalValue = null;
      }
    }

    // If state is terminal, then return the negated terminal value
    if (this.terminalValue !== undefined && this.terminalValue !== null)
      return -this.terminalValue;

    // If node is leaf node
    if (this.actions.size === 0) {
      // Expand, evaluating the state, and return the value
      return -this.expand();
    }

    // Node is not leaf node. Choose best action, get and update the action value,
    // and return the negated value for the previous player.
    const action = this.selectAction();
    const value = action.node.simulate();
    
    // Update variables
    action.avgValue = action.avgValue + (value - action.avgValue) / (action.numChosen + 1);
    ++action.numChosen;
    ++this.actionsChosenTotal;

    return -value;
  }

  getState() {
    return this.state;
  }
}