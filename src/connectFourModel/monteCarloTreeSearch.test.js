import Node from "./monteCarloTreeSearch";
import ConnectFour from "./connectFour";

const randn_bm = (min=-0.5, max=0.5, skew=0) => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
};

const predictFn = (node) => {
  const probs = [0, 0, 0, 0, 0, 0, 0];
  node.actions.forEach(action => {
    probs[action.move] = 1 / node.actions.length;
  });
  return [probs, randn_bm()];
};

test("most visited action is falsy if no more actions", () => {
  const node = new Node();
  node.actions = [];
  expect(node.getMostVisitedAction()).toBeFalsy();
});

test("gets only action as most visited action", () => {
  const node = new Node();
  const action = { numChosen: 0 };
  node.actions = [action];
  expect(node.getMostVisitedAction()).toEqual(action);
});

test("gets most visited action", () => {
  const node = new Node();
  const action1 = { numChosen: 1, avgValue: 1 };
  const action2 = { numChosen: 2, avgValue: 0 };
  node.actions = [action1, action2];
  expect(node.getMostVisitedAction()).toEqual(action2);
});

test("gets most visited action non-deterministically", () => {
  const node = new Node();
  const action1 = { numChosen: 2, avgValue: 1 };
  const action2 = { numChosen: 2, avgValue: 0 };
  node.actions = [action1, action2];
  expect(action1 || action2).toEqual(node.getMostVisitedAction(false));
});

test("finds win in one move", () => {
  const game = new ConnectFour();
  const moves = [3, 1, 3, 2, 3, 6];
  moves.forEach(col => {
    game.makeMove(col);
  });

  const node = new Node({
    state: game,
    predictFn: predictFn
  });
  for (let i = 0; i < 75; ++i) {
    node.simulate();
  }

  expect(node.getMostVisitedAction().move).toBe(3);
});

test("blocks lose in one move", () => {
  const game = new ConnectFour();
  const moves = [0, 6, 6, 5, 0, 4];
  moves.forEach(col => {
    game.makeMove(col);
  });

  const node = new Node({state: game, predictFn: predictFn});
  for (let i = 0; i < 100; ++i) {
    node.simulate();
  }

  expect(node.getMostVisitedAction().move).toBe(3);
});

test("finds win in two moves", () => {
  const game = new ConnectFour();
  const moves = [3, 3, 2, 3, 4, 6];
  moves.forEach(col => {
    game.makeMove(col);
  });

  const node = new Node({state: game, predictFn: predictFn});
  for (let i = 0; i < 300; ++i) {
    node.simulate();
  }

  expect(node.getMostVisitedAction().move).toBe(1);
});

test("blocks lose in two moves", () => {
  const game = new ConnectFour();
  const moves = [3, 3, 2, 2, 4];
  moves.forEach(col => {
    game.makeMove(col);
  });

  const node = new Node({state: game, predictFn: predictFn});
  for (let i = 0; i < 300; ++i) {
    node.simulate();
  }

  expect([1, 5]).toContain(node.getMostVisitedAction().move);
});

test("chooses only valid move", () => {
  const game = new ConnectFour();
  const moves = [
    4, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 3, 4, 3,
    3, 5, 4, 4, 6, 2, 2, 2, 1, 1, 2, 3, 5, 5,
    5, 1, 1, 7, 6, 6, 6, 6, 7, 6, 7, 7, 7
  ];
  moves.forEach(col => {
    game.makeMove(col-1);
  });

  const node = new Node({state: game, predictFn: predictFn});
  for (let i = 0; i < 50; ++i) {
    node.simulate();
  }

  expect(node.actions.length).toBe(1);
  expect(6).toBe(node.getMostVisitedAction().move);
});

test("chooses only valid one of two moves", () => {
  const game = new ConnectFour();
  const moves = [
    4, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 3, 4, 3,
    3, 5, 4, 4, 6, 2, 2, 2, 1, 1, 2, 3, 5, 5,
    5, 1, 1, 7, 6, 6, 6, 6, 7
  ];
  moves.forEach(col => {
    game.makeMove(col-1);
  });

  const node = new Node({state: game, predictFn: predictFn});
  for (let i = 0; i < 50; ++i) {
    node.simulate();
  }

  expect(node.actions.length).toBe(2);
  expect(5 || 6).toBe(node.getMostVisitedAction().move);
});

test("do action prunes tree", () => {
  const game = new ConnectFour();
  const moves = [3, 2, 3, 1, 3, 0];
  moves.forEach(col => {
    game.makeMove(col);
  });

  const node = new Node({state: game, predictFn: predictFn});
  node.simulate();

  node.doAction(node.actions[0]);
  for (let i = 0; i < 75; ++i) {
    node.simulate();
  }

  expect(node.getMostVisitedAction().move).toBe(3);
});