import Head from "next/head";
import { useEffect, useState } from "react";

import styles from "./connect-four.module.scss";
import { Button } from "components/common/Button";
import { DropdownButton } from "components/common/DropdownButton";
import { ConnectFourBoard } from "components/connectFour/ConnectFourBoard";
import { ConnectFourController } from "lib/connectFour/connectFourController";
import { ConnectFourNNStrategyMultiThread } from "lib/connectFour/connectFourNNStrategyMultiThread";
import { ConnectFourStats } from "components/connectFour/ConnectFourStats";

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
    setGrid(newController.getGrid());

    // If computer has first move
    if (player1 !== null) {
      setIsMoveLoading(true);

      // Make computer move
      await newController.makeMove();
      setGrid(newController.getGrid());

      setIsMoveLoading(false);
    }
  };

  const handleColumnClick = async (colIndex) => {
    if (controller === undefined || isMoveLoading) return;
    
    setIsMoveLoading(true);

    await controller.makeMove(colIndex); // Make player move
    setGrid(controller.getGrid());

    // If game is not over
    if (controller.getEnd(0) === "ongoing") {
      await controller.makeMove(); // Make computer move
      setGrid(controller.getGrid());
    }

    setIsMoveLoading(false);
  };

  const terminalValue = controller?.getEnd(playerIndex);

  return (
    <>
      <Head>
        <title>Connect Four</title>
      </Head>

      <div className={styles.gameContainer}>
        <div className={styles.boardContainer}>
          {grid !== undefined && 
            <ConnectFourBoard
              grid={grid}
              onColumnPress={handleColumnClick}
              showHoverPlayer={controller?.getCurrentPlayer() === playerIndex ?
                playerIndex : undefined
              }
              isLoading={isMoveLoading}
              isEnd={terminalValue !== undefined && terminalValue !== "ongoing"?
                terminalValue : undefined
              }
            />
          }
        </div>

        <div className={styles.statsContainer}>
          <ConnectFourStats
            pastMoves={controller?.getPastMoves().map(move => move+1) ?? []}
            prediction={[1, 3, 4, 5]}
            evaluation={0.3}
          />

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
      </div>
    </>
  );
}
