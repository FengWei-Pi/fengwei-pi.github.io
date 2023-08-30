import Head from "next/head";
import { useEffect, useState } from "react";

import styles from "./connect-four.module.scss";
import { Button } from "components/common/Button";
import { DropdownButton } from "components/common/DropdownButton";
import { ConnectFourBoard as Board, NUM_ROWS, NUM_COLS } from "components/connectFour/ConnectFourBoard";
import { ConnectFourController } from "lib/connectFour/connectFourController";
import { ConnectFourNNStrategyMultiThread } from "lib/connectFour/connectFourNNStrategyMultiThread";
import { TerminalValue } from "lib/turnGame/model";
import { ConnectFourBoard } from "lib/connectFour/connectFourBoard";

export default function ConnectFourPage() {
  const [controller, setController] = useState<ConnectFourController>();
  const [grid, setGrid] = useState<Array<Array<number>> | undefined>();
  const [isMoveLoading, setIsMoveLoading] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0); // player 0 goes first, player 1 goes second

  useEffect(() => {
    handleNewGamePress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewGamePress = async () => {
    if (isMoveLoading) return;

    let player1: ConnectFourNNStrategyMultiThread | null = null;
    let player2: ConnectFourNNStrategyMultiThread | null = null;

    if (playerIndex === 0) {
      player2 = new ConnectFourNNStrategyMultiThread();
    } else {
      player1 = new ConnectFourNNStrategyMultiThread();
    }

    const newController = new ConnectFourController(player1, player2);

    setController(newController);
    setGrid(getGridFromGame(newController.getGame()));

    // If computer has first move
    if (player1 !== null) {
      setIsMoveLoading(true);

      // Make computer move
      await newController.makeMove();
      setGrid(getGridFromGame(newController.getGame()));

      setIsMoveLoading(false);
    }
  };

  const handleColumnClick = async (colIndex) => {
    if (controller === undefined || isMoveLoading) return;
    
    setIsMoveLoading(true);

    await controller.makeMove(colIndex); // Make player move
    setGrid(getGridFromGame(controller.getGame()));

    // If game is not over
    if (controller.getGame().getTerminalValue(0) === null) {
      await controller.makeMove(); // Make computer move
      setGrid(getGridFromGame(controller.getGame()));
    }

    setIsMoveLoading(false);
  };

  const terminalValue = controller?.getGame().getTerminalValue(playerIndex);

  const getGridFromGame = (game: ConnectFourBoard) => {
    // Init grid
    const _grid: Array<Array<number>> = [];
    for (let i=0; i<NUM_COLS; ++i) _grid.push([]);

    // Push past moves into grid
    const pastMoves = game ? game.getPastMoves() : [];
    let player = 0;

    for (const move of pastMoves) {
      _grid[move].push(player);
      player = player ^ 1;
    }

    // Fill out rest of grid with -1
    for (const col of _grid) {
      for (let i=col.length; i<NUM_ROWS; ++i) {
        col.push(-1);
      }
    }

    return _grid;
  };

  return (
    <>
      <Head>
        <title>Connect Four</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.boardContainer}>
          {grid !== undefined && 
            <Board
              grid={grid}
              onColumnPress={handleColumnClick}
              className={styles.board}
              showHoverPlayer={controller?.getGame().getCurrentPlayer() === playerIndex ?
                playerIndex : undefined
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
          }
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.button}>
            <DropdownButton
              selectedIndex={playerIndex}
              onChange={index => setPlayerIndex(index)}
            >
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
    </>
  );
}
