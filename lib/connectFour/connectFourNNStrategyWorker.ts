/**
 * Web worker that makes neural network moves for a connect four game.
 * Relevant types are defined in connectFourNNStrategyMultiThread.
 * 
 * @see https://webpack.js.org/guides/web-workers/ for getting web worker uri
 */

import { ConnectFourBoard } from "./connectFourBoard";
import { ConnectFourNeuralNet } from "./connectFourNeuralNet";
import { MCTS_Node_NN } from "../turnGame/mcts_nn";
import { TurnGameNeuralNet } from "../turnGame/neuralNet";
import modelJSON from "./model.json";
import { Action, GetAnalysisResponse, Response } from "./connectFourNNStrategyWorkerTypes";
import type { ConnectFourMove } from "./connectFourBoard";
import type { GetMoveResponse, Message } from "./connectFourNNStrategyWorkerTypes";

let node: MCTS_Node_NN<ConnectFourMove, ConnectFourBoard> | null = null;
let numSimulations = 50;
const analysisStep = 10; // Number of simulations between analysis

/** Updates the internal mcts node to match the provided game state.*/
const updatePastMoves = (pastMoves: Array<ConnectFourMove>) => {
  if (node === null) return;

  // If the provided moves is only a single move ahead of the internal node's
  // past moves, make the move. Otherwise, clear the node.
  const nodeMoves = node.getState().getPastMoves();

  if (pastMoves.length <= 0 || pastMoves.length !== nodeMoves.length) {
    node = null;
    return;
  }

  const lastMove = pastMoves.pop() as number;
  let samePastMoves = true;
  
  for (let i=0; i<pastMoves.length; ++i) {
    if (pastMoves[i] !== nodeMoves[i]) {
      samePastMoves = false;
      break;
    }
  }

  if (!samePastMoves) {
    node = null;
    return;
  }

  // There's only one move difference. Make the move for this.node.
  node.makeMove(lastMove);
};

const getMove = async (pastMoves: Array<ConnectFourMove>) => {
  // If node does not match provided game state, create a new node.
  if (node === null || node.getState().getPastMoves() !== pastMoves) {
    const net = await TurnGameNeuralNet.build(ConnectFourNeuralNet, modelJSON);

    const game = new ConnectFourBoard();
    for (const move of pastMoves) game.makeMove(move);

    node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      game,
      ConnectFourBoard,
      net,
    );
  }

  for (let i=0; i<numSimulations; ++i) {
    node.simulate();

    // Update analysis
    if ((i + 1) % analysisStep === 0) {
      const response : GetAnalysisResponse = {
        action: Response.Analysis,
        payload: node.getAnalysis(),
      };
      postMessage(response);
    }
  }

  const response : GetAnalysisResponse = {
    action: Response.Analysis,
    payload: node.getAnalysis(),
  };
  postMessage(response);

  return node.getMostVisitedMove();
};

onmessage = async (e) => {
  const message = e.data as Message;
  const action = message.action;

  if (action === Action.GetMove) {
    const move = await getMove(message.payload);

    const response : GetMoveResponse = {
      action: Response.Move,
      payload: move
    };
    postMessage(response);
  } else if (action === Action.SetNumSimulations) {
    numSimulations = message.payload;
  } else if (action === Action.UpdatePastMoves) {
    updatePastMoves(message.payload);
  }
};
