import { MCTS_Node_NN } from "./monteCarloTreeSearch";
import { ConnectFourBoard } from "./connectFourBoard";
import type { ConnectFourMove } from "./connectFourBoard";

describe("New node", () => {
  test("Should get state", () => {
    const board = new ConnectFourBoard();
    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(board, ConnectFourBoard);

    expect(node.getState()).toBe(board);
  });

  test("Should simulate with default evaluate function", () => {
    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      new ConnectFourBoard(),
      ConnectFourBoard
    );
    expect(node.simulate()).toBe(-0);
  });

  test("Should simulate with provided evaluate function", () => {
    const evaluate = () => {
      const priors = new Map([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0]
      ]);

      return { priors, value: 0.5 };
    };

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      new ConnectFourBoard(),
      ConnectFourBoard,
      evaluate
    );

    expect(node.simulate()).toBe(-0.5);
  });

  test("Should get most visited move", () => {
    const evaluate = () => {
      const priors = new Map([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0]
      ]);

      return { priors, value: 0.5 };
    };

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      new ConnectFourBoard(),
      ConnectFourBoard,
      evaluate
    );

    for (let i=0; i<10; ++i) {
      node.simulate();
    }

    expect(node.getMostVisitedMove()).toBe(2);
  });

  test("Should make move", () => {
    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      new ConnectFourBoard(),
      ConnectFourBoard
    );

    node.simulate();
    node.makeMove(3);
    const connectFourBoard = node.getState();

    expect(connectFourBoard.getCurrentPlayer()).toBe(1);
    expect(connectFourBoard.getPastMoves()).toEqual([3]);
  });
});

describe("Node with Connect Four board", () => {
  test("Should win in one move", () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(4);
    board.makeMove(3);
    board.makeMove(5);
    board.makeMove(3);
    board.makeMove(2);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard
    );

    for (let i=0; i<200; ++i) {
      node.simulate();
    }

    expect(node.getMostVisitedMove()).toBe(3);
  });

  test("Should prevent loss in one move", () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(4);
    board.makeMove(3);
    board.makeMove(5);
    board.makeMove(3);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard
    );

    for (let i=0; i<200; ++i) {
      node.simulate();
    }

    expect(node.getMostVisitedMove()).toBe(3);
  });

  test("Should win in two moves", () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(3);
    board.makeMove(4);
    board.makeMove(3);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard,
    );

    for (let i=0; i<800; ++i) {
      node.simulate();
    }

    expect([2, 5]).toContain(node.getMostVisitedMove());
  });

  test("Should prevent loss in two move", () => {
    const board = new ConnectFourBoard();
    board.makeMove(3);
    board.makeMove(3);
    board.makeMove(4);

    const node = new MCTS_Node_NN<ConnectFourMove, ConnectFourBoard>(
      board,
      ConnectFourBoard,
    );
    
    for (let i=0; i<1600; ++i) {
      node.simulate();
    }

    expect([2, 5]).toContain(node.getMostVisitedMove());
  });
});
