import { ConnectFour } from "./connectFour";
import { TerminalValue } from "../turnGame/turnGame";

describe("New game", () => {
  const getGame = () => {
    return new ConnectFour();
  };

  test("Should clone", () => {
    const game = getGame();
    const clone = game.clone();

    expect(clone).not.toBe(game);
    expect(clone).toEqual(game);
  });

  test("Should get current player", () => {
    const game = getGame();
    
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("Should check valid moves", () => {
    const game = getGame();

    const validMoves = [0, 1, 2, 3, 4, 5, 6];

    for (const move of validMoves) {
      expect(game.isValidMove(move)).toBe(true);
    }
  });

  test("Should get valid moves", () => {
    const game = getGame();
    const moves = game.getValidMoves();

    expect(moves.sort()).toEqual([0, 1, 2, 3, 4, 5, 6].sort());
  });

  test("Should get no past moves", () => {
    const game = getGame();
    const moves = game.getPastMoves();

    expect(moves).toEqual([]);
  });

  test("Should get terminal value", () => {
    const game = getGame();
    expect(game.getTerminalValue(0)).toBe(null);
    expect(game.getTerminalValue(1)).toBe(null);
  });

  test("Should throw getting terminal value of invalid player", () => {
    const game = getGame();
    expect(() => game.getTerminalValue(-1)).toThrow();
  });

  test("Should make valid move", () => {
    const game = getGame();
    expect(() => game.makeMove(2)).not.toThrow();
  });

  test("Should throw making invalid move", () => {
    const game = getGame();
    expect(() => game.makeMove(-1)).toThrow();
  });

  test("Should throw undoing move", () => {
    const game = getGame();
    expect(() => game.undoMove()).toThrow();
  });
});

describe("Game after one move", () => {
  const getGame = () => {
    const game = new ConnectFour();
    game.makeMove(4);

    return game;
  };

  test("Should clone", () => {
    const game = getGame();
    const clone = game.clone();

    expect(clone).not.toBe(game);
    expect(clone).toEqual(game);
  });

  test("Should get current player", () => {
    const game = getGame();
    expect(game.getCurrentPlayer()).toBe(1);
  });

  test("Should check valid moves", () => {
    const game = getGame();

    const validMoves = [0, 1, 2, 3, 4, 5, 6];
    
    for (const move of validMoves) {
      expect(game.isValidMove(move)).toBe(true);
    }
  });

  test("Should get valid moves", () => {
    const game = getGame();
    const moves = game.getValidMoves();

    const expected = [0, 1, 2, 3, 4, 5, 6];
    expect(moves.sort()).toEqual(expected.sort());
  });

  test("Should get past moves", () => {
    const game = getGame();
    const moves = game.getPastMoves();

    expect(moves).toEqual([4]);
  });

  test("Should get terminal value", () => {
    const game = getGame();
    expect(game.getTerminalValue(0)).toBe(null);
    expect(game.getTerminalValue(1)).toBe(null);
  });

  test("Should throw getting terminal value of invalid player", () => {
    const game = getGame();
    expect(() => game.getTerminalValue(-1)).toThrow();
  });

  test("Should make valid move", () => {
    const game = getGame();
    expect(() => game.makeMove(2)).not.toThrow();
  });

  test("Should throw making invalid move", () => {
    const game = getGame();
    expect(() => game.makeMove(-1)).toThrow();
  });

  test("Should undo move", () => {
    const game = getGame();

    expect(() => game.undoMove()).not.toThrow();
    expect(game.getCurrentPlayer()).toBe(0);
    expect(game.getTerminalValue(0)).toBe(null);
    expect(game.getTerminalValue(1)).toBe(null);
    expect(() => game.getTerminalValue(-1)).toThrow();
    expect(game.getPastMoves()).toEqual([]);
  });
});

describe("Game after several moves and undos", () => {
  const getGame = () => {
    const game = new ConnectFour();
    const moves = [3, 3, 3, 3, 3, 3, 4, 4, 4];

    for (let i=0; i<3; ++i) game.makeMove(moves[i]);

    game.makeMove(6);
    game.makeMove(0);
    game.undoMove();
    game.undoMove();

    for (let i=3; i<6; ++i) game.makeMove(moves[i]);
    
    game.makeMove(2);
    game.undoMove();

    for (let i=6; i<moves.length; ++i) game.makeMove(moves[i]);

    /*
      Game looks like
      - - - x - - -
      - - - o - - -
      - - - x - - -
      - - - o - - -
      - - - o - - -
      o x x x - - -
    */
    return game;
  };

  test("Should clone", () => {
    const game = getGame();
    const clone = game.clone();

    expect(clone).not.toBe(game);
    expect(clone).toEqual(game);
  });

  test("Should get current player", () => {
    const game = getGame();
    expect(game.getCurrentPlayer()).toBe(1);
  });

  test("Should check valid moves", () => {
    const game = getGame();

    const validMoves = [0, 1, 2, 4, 5, 6];

    for (const move of validMoves) {
      expect(game.isValidMove(move)).toBe(true);
    }
    expect(game.isValidMove(3)).toBe(false);
  });

  test("Should get valid moves", () => {
    const game = getGame();
    const moves = game.getValidMoves();

    const expected = [0, 1, 2, 4, 5, 6];
    expect(moves.sort()).toEqual(expected.sort());
  });

  test("Should get past moves", () => {
    const game = getGame();
    const moves = game.getPastMoves();

    expect(moves).toEqual([3, 3, 3, 3, 3, 3, 4, 4, 4]);
  });

  test("Should get terminal value", () => {
    const game = getGame();
    expect(game.getTerminalValue(0)).toBe(null);
    expect(game.getTerminalValue(1)).toBe(null);
  });

  test("Should throw getting terminal value of invalid player", () => {
    const game = getGame();
    expect(() => game.getTerminalValue(-1)).toThrow();
  });

  test("Should make valid move", () => {
    const game = getGame();
    expect(() => game.makeMove(2)).not.toThrow();
  });

  test("Should throw making invalid move", () => {
    const game = getGame();
    expect(() => game.makeMove(-1)).toThrow();
  });
});

describe("Game after win", () => {
  const getGame = () => {
    const game = new ConnectFour();
    const moves = [3, 4, 3, 4, 3, 4, 3];

    for (let i=0; i<moves.length; ++i) game.makeMove(moves[i]);

    game.undoMove();
    game.undoMove();
    game.makeMove(2);
    game.makeMove(3);
    game.undoMove();
    game.undoMove();

    game.makeMove(moves[moves.length-2]);
    game.makeMove(moves[moves.length-1]);

    /*
      Game looks like
      - - - - - - -
      - - - - - - -
      - - - x - - -
      - - - x o - -
      - - - x o - -
      - - - x o - -
    */
    return game;
  };

  test("Should clone", () => {
    const game = getGame();
    const clone = game.clone();

    expect(clone).not.toBe(game);
    expect(clone).toEqual(game);
  });

  test("Should get current player", () => {
    const game = getGame();
    expect(game.getCurrentPlayer()).toBe(1);
  });

  test("Should check valid moves", () => {
    const game = getGame();

    const validMoves = [0, 1, 2, 3, 4, 5, 6];

    for (const move of validMoves) {
      expect(game.isValidMove(move)).toBe(true);
    }
  });

  test("Should get valid moves", () => {
    const game = getGame();
    const moves = game.getValidMoves();

    const expected = [0, 1, 2, 3, 4, 5, 6];
    expect(moves.sort()).toEqual(expected.sort());
  });

  test("Should get past moves", () => {
    const game = getGame();
    const moves = game.getPastMoves();

    expect(moves).toEqual([3, 4, 3, 4, 3, 4, 3]);
  });

  test("Should get terminal value", () => {
    const game = getGame();
    expect(game.getTerminalValue(0)).toBe(TerminalValue.WIN);
    expect(game.getTerminalValue(1)).toBe(TerminalValue.LOSS);
  });

  test("Should throw getting terminal value of invalid player", () => {
    const game = getGame();
    expect(() => game.getTerminalValue(-1)).toThrow();
  });
});

describe("Game after win with full board", () => {
  const getGame = () => {
    const game = new ConnectFour();
    const moves = [
      3, 3, 3, 3, 3, 3, 4, 2, 4, 4, 4, 4, 2, 1, 2, 2, 2, 2, 1, 1, 1,
      1, 4, 1, 5, 6, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0
    ];

    for (let i=0; i<moves.length; ++i) game.makeMove(moves[i]);

    game.undoMove();
    game.undoMove();
    game.makeMove(0);
    game.makeMove(0);
    game.undoMove();
    game.undoMove();

    game.makeMove(moves[moves.length-2]);
    game.makeMove(moves[moves.length-1]);

    /*
      Game looks like
      o o o o x x o
      x o x x o o x
      o x o o x x o
      x o x x o o x
      o x x o x x o
      x o o x x x o
    */
    return game;
  };

  test("Should clone", () => {
    const game = getGame();
    const clone = game.clone();

    expect(clone).not.toBe(game);
    expect(clone).toEqual(game);
  });

  test("Should get current player", () => {
    const game = getGame();
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("Should check valid moves", () => {
    const game = getGame();

    for (let i=0; i<7; ++i) {
      expect(game.isValidMove(i)).toBe(false);
    }
  });

  test("Should get valid moves", () => {
    const game = getGame();
    expect(game.getValidMoves()).toEqual([]);
  });

  test("Should get past moves", () => {
    const game = getGame();
    const moves = game.getPastMoves();

    expect(moves).toEqual([
      3, 3, 3, 3, 3, 3, 4, 2, 4, 4, 4, 4, 2, 1, 2, 2, 2, 2, 1, 1, 1,
      1, 4, 1, 5, 6, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0
    ]);
  });

  test("Should get terminal value", () => {
    const game = getGame();
    expect(game.getTerminalValue(0)).toBe(TerminalValue.LOSS);
    expect(game.getTerminalValue(1)).toBe(TerminalValue.WIN);
  });

  test("Should throw getting terminal value of invalid player", () => {
    const game = getGame();
    expect(() => game.getTerminalValue(-1)).toThrow();
  });
});

describe("Game after draw", () => {
  const getGame = () => {
    const game = new ConnectFour();
    const moves = [
      3, 3, 3, 3, 3, 3, 4, 2, 2, 4, 4, 2, 4, 1, 2, 4, 1, 4, 2, 2, 1,
      5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 1, 1, 0
    ];

    for (let i=0; i<moves.length; ++i) game.makeMove(moves[i]);

    game.undoMove();
    game.undoMove();
    game.makeMove(0);
    game.makeMove(1);
    game.undoMove();
    game.undoMove();

    game.makeMove(moves[moves.length-2]);
    game.makeMove(moves[moves.length-1]);

    /*
      Game looks like
      o x o o o x x
      x o x x o o o
      o o x o x x x
      x x o x x o o
      o x x o o x x
      x o o x x o o
    */
    return game;
  };

  test("Should clone", () => {
    const game = getGame();
    const clone = game.clone();

    expect(clone).not.toBe(game);
    expect(clone).toEqual(game);
  });

  test("Should get current player", () => {
    const game = getGame();
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("Should check valid moves", () => {
    const game = getGame();

    for (let i=0; i<7; ++i) {
      expect(game.isValidMove(i)).toBe(false);
    }
  });

  test("Should get valid moves", () => {
    const game = getGame();
    expect(game.getValidMoves()).toEqual([]);
  });

  test("Should get past moves", () => {
    const game = getGame();
    const moves = game.getPastMoves();

    expect(moves).toEqual([
      3, 3, 3, 3, 3, 3, 4, 2, 2, 4, 4, 2, 4, 1, 2, 4, 1, 4, 2, 2, 1,
      5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 1, 1, 0
    ]);
  });

  test("Should get terminal value", () => {
    const game = getGame();
    expect(game.getTerminalValue(0)).toBe(TerminalValue.DRAW);
    expect(game.getTerminalValue(1)).toBe(TerminalValue.DRAW);
  });

  test("Should throw getting terminal value of invalid player", () => {
    const game = getGame();
    expect(() => game.getTerminalValue(-1)).toThrow();
  });
});
