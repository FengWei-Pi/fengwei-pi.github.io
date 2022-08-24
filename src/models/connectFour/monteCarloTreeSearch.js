import PD from "probability-distributions";

import { ConnectFour } from "./connectFour";

/**
 * Action: {
 * 	node = Node,
 *  move, // column index
 *  numChosen,
 *  avgValue,
 *  priorProb
 * }
 */

export default class Node {
  // As of Aug 2021, static variables are in a stage 3 proposal, and are not part of EMCAscript yet.
  // Static methods are a workaround.
  static explorationConstant() { return 1; }
  static dirichletAlpha() { return 0.8; }
  static noisePercent() { return 0.2; }
	
  /**
	 * Optionally pass an params object. `predictFn` gets passed the current node as the parameter and must return an
	 * array with two elements. The first element is an array of prior probabilities over all moves, and the second
	 * is the value of the state of the passed node. If `predictFn` is not given, it defaults to to uniform probability
	 * over all actions and value of 0.
	 * 
	 * ex. Connect four has 7 moves, so probabilities.length = 7. If only the first three columns are available actions,
	 * then, by default, probabilities = [1/3, 1/3, 1/3, 0, 0, 0, 0]
	 * 
	 * @param {Object} [params]
	 * @param {Object} params.state
	 * @param {Function} params.predictFn
	 */
  constructor(params) {
    const { state, predictFn } = params || {};

    this.state = state || new ConnectFour();
    this.actions = [];
    this.predict = predictFn || function (node) {
      const probs = [0, 0, 0, 0, 0, 0, 0];
      node.actions.forEach(action => {
        probs[action.move] = 1 / node.actions.length;
      });
      return [probs, 0];
    };

    this.actionsChosenTotal = 0;
    this.terminalValue = null; // Only defined for node where game state is terminal
    this.isTerminal = null;

    if (state === undefined) this.__expand();
  }

  // Private //
  __getActionValue(action) {
    return action.avgValue +
			action.priorProb * Node.explorationConstant() * Math.sqrt(this.actionsChosenTotal) / (1 + action.numChosen);
  }

  __selectAction() {
    let bestValue = null;
    let bestAction = null;

    this.actions.forEach(action => {
      const value = this.__getActionValue(action);
      if (bestValue === null || value > bestValue) {
        bestValue = value;
        bestAction = action;
      }
    });

    return bestAction;
  }

  __expand() {
    const [probabilities, value] = this.predict(this);

    this.actions = this.state.getValidMoves();

    const noise = PD.rgamma(this.actions.length, Node.dirichletAlpha(), 1);
    const totalNoise = noise.reduce((a, b) => a + b, 0);

    let totalProb = 1;
    if (this.actions.length < 7) {
      totalProb = 0;
      this.actions.forEach(col => {
        totalProb += probabilities[col];
      });
    }

    this.actions = this.actions.map((col, index) => {
      const node = new Node({
        state: new ConnectFour(this.state),
        predictFn: this.predict
      });
      node.state.makeMove(col);

      return {
        node: node,
        move: col,
        numChosen: 0,
        avgValue: 0,
        priorProb: probabilities[col]/totalProb*(1-Node.noisePercent()) + noise[index]/totalNoise*Node.noisePercent(),
      };
    });

    return value;
  }

  // Public //
  // Returns the action with the most visits
  getMostVisitedAction(deterministic = true) {
    if (deterministic) {
      let bestAction = null;
      this.actions.forEach(action => {
        if (!bestAction || action.numChosen > bestAction.numChosen) {
          bestAction = action;
        }
      });
      return bestAction;
    } else {
      let rand = Math.random();
      for (const action of this.actions) {
        if (rand < action.numChosen / this.actionsChosenTotal) return action;
        rand -= action.numChosen / this.actionsChosenTotal;
      }
    }

    throw new Error("In monteCarloTreeSearch.js, getMostVisitedAction, no action returned");
  }

  // Change this node to be the child node of the provided action.
  doAction(action) {
    this.state = action.node.state;
    this.actions = action.node.actions;
    this.terminalValue = action.node.terminalValue;
    this.isTerminal = action.node.isTerminal;

    this.actionsChosenTotal = action.node.actionsChosenTotal;
  }

  // Returns the value of the current state for the previous player
  simulate() {
    // If game ended, return the value
    if (this.isTerminal === true) return -this.terminalValue;
    if (this.isTerminal === null) {
      // Using true value
      const terminalValue = this.state.getTerminalValue(this.state.getCurrentPlayer());
      if (terminalValue === -1) {
        this.isTerminal = true;
        this.terminalValue = -1;
        return -this.terminalValue;
      } else if (terminalValue === 0) {
        this.isTerminal = true;
        this.terminalValue = 0;
        return -this.terminalValue;
      } else {
        this.isTerminal = false;
      }
    }
    /* Using nn value
    if (this.isTerminal === true) return -this.terminalValue;
    if (this.isTerminal === null && (this.state.hasWon() || this.state.isFull())) {
      const [, value] = this.predict(this); // using nn value
      this.terminalValue = value;
      this.isTerminal = true;
      return -this.terminalValue;
    } else {
      this.isTerminal = false;
    }
    */

    // If node is leaf node
    if (this.actions.length === 0) {
      // Expand, evaluating the state, and return the value
      return -this.__expand();
    }

    // Choose best action, get and update the action value,
    // and return the negated value for the previous player
    const action = this.__selectAction();
    const value = action.node.simulate();
    action.avgValue = action.avgValue + (value - action.avgValue) / (action.numChosen + 1);

    // Update member variables
    ++this.actionsChosenTotal;
    ++action.numChosen;

    return -value;
  }
}