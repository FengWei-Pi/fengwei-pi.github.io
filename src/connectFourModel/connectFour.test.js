import ConnectFour from "./connectFour";

describe("new game", () => {
  let game;

  beforeAll(() => {
    game = new ConnectFour();
  });

  test("current player is player 0", () => {
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("last player is player 1", () => {
    expect(game.getLastPlayer()).toBe(1);
  });

  test("valid moves are 0 to 6", () => {
    const moves = game.getValidMoves();
    const expected = [0, 1, 2, 3, 4, 5, 6];

    expect(moves).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(moves));
  });

  test("no one has won", () => {
    expect(game.hasWon()).toBe(false);
  });

  test("game is not full", () => {
    expect(game.isFull()).toBe(false);
  });

  test("no pieces", () => {
    const pieces = game.getPieces();
    expect(pieces.length).toBe(0);
  });

  test("board is empty", () => {
    const board = game.getBoard();
    for (let i=0; i<7; ++i) {
      expect([-1]).toEqual(expect.arrayContaining(board[i]));
    }
  });

  test("deep copies", () => {
    const game2 = new ConnectFour(game);
    game2.makeMove(1);

    expect(game.getCurrentPlayer()).toBe(0);
    expect(game2.getCurrentPlayer()).toBe(1);
  });
});

describe("game after one move", () => {
  let game;

  beforeAll(() => {
    game = new ConnectFour();
    game.makeMove(3);
  });

  test("current player is player 1", () => {
    expect(game.getCurrentPlayer()).toBe(1);
  });

  test("last player is player 0", () => {
    expect(game.getLastPlayer()).toBe(0);
  });

  test("valid moves are 0 to 6", () => {
    const moves = game.getValidMoves();
    const expected = [0, 1, 2, 3, 4, 5, 6];

    expect(moves).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(moves));
  });

  test("no one has won", () => {
    expect(game.hasWon()).toBe(false);
  });

  test("game is not full", () => {
    expect(game.isFull()).toBe(false);
  });

  test("player 0 has the only piece on the board", () => {
    const pieces = game.getPieces();
    expect(pieces.length).toBe(1);
    expect(pieces[0]).toEqual(expect.arrayContaining([3, 0]));
  });

  test("deep copies", () => {
    const game2 = new ConnectFour(game);
    game2.makeMove(1);

    expect(game.getCurrentPlayer()).toBe(1);
    expect(game2.getCurrentPlayer()).toBe(0);
  });
});

describe("game after two moves", () => {
  let game;

  beforeAll(() => {
    game = new ConnectFour();
    game.makeMove(4);
    game.makeMove(4);
  });

  test("current player is player 0", () => {
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("last player is player 1", () => {
    expect(game.getLastPlayer()).toBe(1);
  });

  test("valid moves are 0 to 6", () => {
    const moves = game.getValidMoves();
    const expected = [0, 1, 2, 3, 4, 5, 6];

    expect(moves).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(moves));
  });

  test("player 0 has one piece", () => {
    const pieces = game.getPieces();
    const expected = [4, 0, 0];

    expect(pieces[0]).toEqual(expect.arrayContaining(expected));
    expect(expect.arrayContaining(expected)).toEqual(pieces[0]);
  });

  test("player 1 has one piece", () => {
    const pieces = game.getPieces();
    const expected = [4, 1, 1];

    expect(pieces[1]).toEqual(expect.arrayContaining(expected));
    expect(expect.arrayContaining(expected)).toEqual(pieces[1]);
  });

  test("board has two, correct pieces", () => {
    const board = game.getBoard();
    for (let i=0; i<7; ++i) {
      if (i === 4) continue;
      expect([-1]).toEqual(expect.arrayContaining(board[i]));
    }
    expect([0, 1, -1, -1, -1, -1]).toEqual(board[4]);
  });

  test("no one has won", () => {
    expect(game.hasWon()).toBe(false);
  });

  test("game is not full", () => {
    expect(game.isFull()).toBe(false);
  });
});

describe("game after one move and undo", () => {
  let game;

  beforeAll(() => {
    game = new ConnectFour();
    game.makeMove(1);
    game.undoMove();
  });

  test("current player is player 0", () => {
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("last player is player 1", () => {
    expect(game.getLastPlayer()).toBe(1);
  });

  test("valid moves are 0 to 6", () => {
    const moves = game.getValidMoves();
    const expected = [0, 1, 2, 3, 4, 5, 6];

    expect(moves).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(moves));
  });

  test("no one has won", () => {
    expect(game.hasWon()).toBe(false);
  });

  test("game is not full", () => {
    expect(game.isFull()).toBe(false);
  });

  test("boards are empty", () => {
    const pieces = game.getPieces();
    expect(pieces.length).toBe(0);
  });
});

describe("game after six moves in column index 2", () => {
  let game;

  beforeAll(() => {
    game = new ConnectFour();
    game.makeMove(2);
    game.makeMove(2);
    game.makeMove(2);
    game.makeMove(2);
    game.makeMove(2);
    game.makeMove(2);
  });

  test("current player is player 0", () => {
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("last player is player 1", () => {
    expect(game.getLastPlayer()).toBe(1);
  });

  test("valid moves are 0, 1, 3, 4, 5, 6", () => {
    const moves = game.getValidMoves();
    const expected = [0, 1, 3, 4, 5, 6];

    expect(moves).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(moves));
  });

  test("no one has won", () => {
    expect(game.hasWon()).toBe(false);
  });

  test("game is not full", () => {
    expect(game.isFull()).toBe(false);
  });

  test("player 0 has three pieces in column index 2", () => {
    const boards = game.getPieces();
    const expected = [[2, 0, 0], [2, 2, 0], [2, 4, 0]];

    expected.forEach((coord, index) => {
      expect(boards[index]).toEqual(expect.arrayContaining(coord));
      expect(expect.arrayContaining(coord)).toEqual(boards[index]);
    });
  });

  test("player 1 has three pieces in column index 2", () => {
    const boards = game.getPieces();
    const expected = [[2, 1, 1], [2, 3, 1], [2, 5, 1]];

    expected.forEach((coord, index) => {
      expect(boards[index + 3]).toEqual(expect.arrayContaining(coord));
      expect(expect.arrayContaining(coord)).toEqual(boards[index + 3]);
    });
  });
});

describe("game after four in a row by player 0", () => {
  let game;

  beforeAll(() => {
    game = new ConnectFour();

    const moves = [
      4, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 3, 4, 3,
      3, 5, 4, 4, 6, 2, 2, 2, 1, 1, 2, 3, 5, 5,
      5, 1, 1, 7, 7, 6, 6, 7, 6, 7, 6, 7, 6,
    ];
    moves.forEach(col => {
      game.makeMove(col - 1);
    });
  });

  test("current player is player 1", () => {
    expect(game.getCurrentPlayer()).toBe(1);
  });

  test("last player is player 0", () => {
    expect(game.getLastPlayer()).toBe(0);
  });

  test("valid move is 6", () => {
    const moves = game.getValidMoves();
    const expected = [6];

    expect(moves).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(moves));
  });

  test("player 0 has won", () => {
    expect(game.hasWon()).toBe(true);
  });

  test("game is not full", () => {
    expect(game.isFull()).toBe(false);
  });

  describe("deep copy", () => {
    let game2;

    beforeAll(() => {
      game2 = new ConnectFour(game);
      game2.undoMove();
    });

    test("gets correct player", () => {
      expect(game.getCurrentPlayer()).toBe(1);
      expect(game2.getCurrentPlayer()).toBe(0);
    });

    test("hasnt won", () => {
      expect(game.hasWon()).toBe(true);
      expect(game2.hasWon()).toBe(false);
    });

    test("gets valid moves", () => {
      game2.undoMove();

      const moves = game.getValidMoves();
      const moves2 = game2.getValidMoves();
      const expected = [6];
      const expected2 = [5, 6];

      expect(moves).toEqual(expect.arrayContaining(expected));
      expect(expected).toEqual(expect.arrayContaining(moves));

      expect(moves2).toEqual(expect.arrayContaining(expected2));
      expect(expected2).toEqual(expect.arrayContaining(moves2));
    });
  });
});

describe("game ends in draw", () => {
  let game;

  beforeAll(() => {
    game = new ConnectFour();

    const moves = [
      4, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 3, 4, 3,
      3, 5, 4, 4, 6, 2, 2, 2, 1, 1, 2, 3, 5, 5,
      5, 1, 1, 7, 6, 6, 6, 6, 7, 6, 7, 7, 7, 7
    ];
    moves.forEach(col => {
      game.makeMove(col - 1);
    });
  });

  test("current player is player 0", () => {
    expect(game.getCurrentPlayer()).toBe(0);
  });

  test("last player is player 1", () => {
    expect(game.getLastPlayer()).toBe(1);
  });

  test("no valid moves", () => {
    const moves = game.getValidMoves();
    const expected = [];

    expect(moves).toEqual(expect.arrayContaining(expected));
    expect(expected).toEqual(expect.arrayContaining(moves));
  });

  test("player 1 did not win", () => {
    expect(game.hasWon()).toBe(false);
  });

  test("game is full", () => {
    expect(game.isFull()).toBe(true);
  });
});