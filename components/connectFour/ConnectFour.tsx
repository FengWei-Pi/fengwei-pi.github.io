/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState, useMemo } from "react";

import styles from "./ConnectFour.module.scss";
import { Button } from "components/common/Button";
import { DropdownButton } from "components/common/DropdownButton";

import { ConnectFourBoard as Board } from "./ConnectFourBoard";
import { ConnectFourController } from "lib/connectFour/connectFourController";
import { ConnectFourNNStrategyMultiThread } from "lib/connectFour/connectFourNNStrategyMultiThread";
import { TerminalValue } from "lib/turnGame/model";
import { ConnectFourBoard } from "lib/connectFour/connectFourBoard";

// TODO change loader styling to something better. Check that it works on small screens.
export default function ConnectFour() {
  const [controller, setController] = useState<ConnectFourController>();
  const [game, setGame] = useState<ConnectFourBoard>();
  const [isMoveLoading, setIsMoveLoading] = useState(false);

  const [hoveringCol, setHoveringCol] = useState(null);
  // TODO change dropdown button to be controlled component. change this ref to state
  const playerIndexRef = useRef(0); // player 0 goes first, player 1 goes second

  useEffect(() => {
    handleNewGamePress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewGamePress = async () => {
    if (isMoveLoading) return;

    let player1: ConnectFourNNStrategyMultiThread | null = null;
    let player2: ConnectFourNNStrategyMultiThread | null = null;

    if (playerIndexRef.current === 0) {
      player2 = new ConnectFourNNStrategyMultiThread();
    } else {
      player1 = new ConnectFourNNStrategyMultiThread();
    }

    const newController = new ConnectFourController(player1, player2);

    setController(newController);
    setGame(newController.getGame());

    // If computer has first move
    if (player1 !== null) {
      setIsMoveLoading(true);

      // Make computer move
      await newController.makeMove();
      setGame(new ConnectFourBoard(newController.getGame()));

      setIsMoveLoading(false);
    }
  };

  const handleColumnClick = async (colIndex) => {
    if (controller === undefined || isMoveLoading) return;
    
    setIsMoveLoading(true);

    await controller.makeMove(colIndex); // Make player move
    setGame(new ConnectFourBoard(controller.getGame()));

    // If game is not over
    if (controller.getGame().getTerminalValue(0) === null) {
      await controller.makeMove(); // Make computer move
      setGame(new ConnectFourBoard(controller.getGame()));
    }

    setIsMoveLoading(false);
  };

  const handleHoverEnter = (colIndex) => {
    // Show move preview
    setHoveringCol(colIndex);
  };

  const handleHoverLeave = () => {
    // Stop showing move preview
    setHoveringCol(null);
  };

  const terminalValue = useMemo(() => {
    return game && game.getTerminalValue(playerIndexRef.current);
  }, [game]);

  const board = useMemo(() => {
    const board: Array<Array<number>> = [[], [], [], [], [], [], []];

    const heights = [0, 0, 0, 0, 0, 0, 0];
    const pastMoves = game ? game.getPastMoves() : [];
    let player = 0;

    for (const move of pastMoves) {
      board[move].push(player);
      ++heights[move];
      player = player ^ 1;
    }

    for (let i=0; i<7; ++i) {
      for (let j=heights[i]; j<6; ++j) {
        board[i].push(-1);
      }
    }

    return {
      grid: board,
      heights
    };
  }, [game]);

  return (
    <div className={styles.container}>
      <div className={styles.boardContainer}>
        <Board
          grid={board.grid}
          onColumnPress={handleColumnClick}
          className={styles.board}
          showHoverPlayer={game?.getCurrentPlayer() === playerIndexRef.current ?
            playerIndexRef.current : undefined
          }
          isLoading={isMoveLoading}
          isEnd={
            terminalValue === TerminalValue.Loss ?
              "loss" :
              terminalValue === TerminalValue.Draw ?
                "draw" :
                terminalValue === TerminalValue.Win ?
                  "win" :
                  undefined
          }
        />
      </div>
      <div className={styles.buttonContainer} style={{ position: "relative" }}>
        <div className={styles.button}>
          <DropdownButton onChange={index => playerIndexRef.current = index}>
            <div>Player 1</div>
            <div>Player 2</div>
          </DropdownButton>
        </div>
        <div className={styles.button}>
          <Button onClick={handleNewGamePress}>
          New Game
          </Button>
        </div>
        {isMoveLoading && <div className={styles.loader}></div>}
      </div>
    </div>
  );
}