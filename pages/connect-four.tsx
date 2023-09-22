import Head from "next/head";
import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";

import styles from "./connect-four.module.scss";
import { Button } from "components/common/Button";
import { DropdownButton } from "components/common/DropdownButton";
import { ConnectFourBoard } from "components/connectFour/ConnectFourBoard";
import { ConnectFourController } from "lib/connectFour/connectFourController";
import { ConnectFourNNStrategyMultiThread } from "lib/connectFour/connectFourNNStrategyMultiThread";
import { ConnectFourStats } from "components/connectFour/ConnectFourStats";
// TODO: think of a way to not depend on internal representation
// idea: move `getAnalysis` code that depends on internal representation from here to controller
import type { Analysis } from "lib/turnGame/mcts_nn";
import type { ConnectFourMove } from "lib/connectFour/connectFourBoard";
import { TerminalValue } from "lib/turnGame/model";

export default function ConnectFourPage() {
  const [controller, setController] = useState<ConnectFourController>();
  const computerPlayer = useRef<ConnectFourNNStrategyMultiThread>();
  const [analysis, setAnalysis] = useState<Analysis<ConnectFourMove>>({ prediction: [] });
  const [grid, setGrid] = useState<Array<Array<number>>>();
  const [isMoveLoading, setIsMoveLoading] = useState(false);
  const [boardContainer, setBoardContainer] = useState<HTMLDivElement>();
  const statsContainerRef = useRef<HTMLDivElement>(null);

  // player 0 goes first, player 1 goes second
  const [playerDropdown, setPlayerDrodown] = useState(0); // dropdown selection
  const [playerCur, setPlayerCur] = useState(0); // player index of user's current game

  useEffect(() => {
    handleNewGamePress();
    // only run once on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBoardContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (el === null) return;
    setBoardContainer(el);
  }, []);

  // Update stats container max height to same as board's height
  useLayoutEffect(() => {
    if (boardContainer === undefined) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.borderBoxSize && entry.borderBoxSize[0] && statsContainerRef.current) {
          statsContainerRef.current.style.maxHeight = entry.contentRect.height + "px";
        }
      }
    });

    resizeObserver.observe(boardContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [boardContainer]);

  const makeComputerMove = async (controller: ConnectFourController) => {
    setIsMoveLoading(true);

    // Update analysis periodically
    const getAnalysisDelay = 200;
    const analysisInterval = setInterval(() => {
      if (!computerPlayer.current) return;

      const _analysis = computerPlayer.current.getAnalysis();
      if (JSON.stringify(_analysis) !== JSON.stringify(analysis)) {
        setAnalysis(_analysis);
      }
    }, getAnalysisDelay);

    await controller.makeMove();
    setGrid(controller.getGrid());

    clearInterval(analysisInterval);
    if (computerPlayer.current) setAnalysis(computerPlayer.current.getAnalysis());

    setIsMoveLoading(false);
  };

  const handleNewGamePress = async () => {
    if (isMoveLoading) return;

    let player1: ConnectFourNNStrategyMultiThread | null = null;
    let player2: ConnectFourNNStrategyMultiThread | null = null;

    if (playerDropdown === 0) {
      player2 = new ConnectFourNNStrategyMultiThread();
      computerPlayer.current = player2;
    } else {
      player1 = new ConnectFourNNStrategyMultiThread();
      computerPlayer.current = player1;
    }

    const newController = new ConnectFourController(player1, player2);

    setController(newController);
    setGrid(newController.getGrid());
    setAnalysis({ prediction: [] });
    setPlayerCur(playerDropdown);

    // If computer has first move
    if (player1 !== null) makeComputerMove(newController);
  };

  const handleColumnClick = async (colIndex) => {
    if (controller === undefined || isMoveLoading) return;

    await controller.makeMove(colIndex); // Make player move
    setGrid(controller.getGrid());

    // If game is not over
    if (controller.getEnd(0) === "ongoing") {
      makeComputerMove(controller);
    }
  };

  const terminalValue = controller?.getEnd(playerCur);

  return (
    <>
      <Head>
        <title>Connect Four</title>
      </Head>

      <div className={styles.gameContainer}>
        <div className={styles.boardContainer} ref={setBoardContainerRef}>
          {grid !== undefined && 
            <ConnectFourBoard
              grid={grid}
              onColumnPress={handleColumnClick}
              showHoverPlayer={controller?.getCurrentPlayer() === playerCur ?
                playerCur : undefined
              }
              isLoading={isMoveLoading}
              isEnd={terminalValue !== undefined && terminalValue !== "ongoing"?
                terminalValue : undefined
              }
            />
          }
        </div>

        <div className={styles.sideContainer}>
          <div className={styles.statsContainer} ref={statsContainerRef}>
            <ConnectFourStats
              className={styles.stats}
              player1={playerCur === 0 ? "You" : "Computer"}
              player2={playerCur === 0 ? "Computer" : "You"}
              pastMoves={controller?.getPastMoves().map(move => move+1)}
              prediction={analysis.prediction.map(move => move+1)}
              predictionEnd={{
                end: analysis.terminalValue === TerminalValue.Win ?
                  "win" : analysis.terminalValue === TerminalValue.Draw ?
                    "draw" : analysis.terminalValue === TerminalValue.Loss ?
                      "loss" : "ongoing",
                player: playerCur === 0 ? 2 : 1
              }}
              evaluation={analysis.winPercent !== undefined ? {
                winPercent: analysis.winPercent,
                player: playerCur === 0 ? 2 : 1
              } : undefined}
            />
          </div>

          <div className={styles.buttonContainer}>
            <div className={styles.button}>
              <DropdownButton
                selectedIndex={playerDropdown}
                onChange={index => setPlayerDrodown(index)}
              >
                <div>Player One</div>
                <div>Player Two</div>
              </DropdownButton>
            </div>

            <div className={styles.button}>
              <Button onClick={handleNewGamePress}>
              New Game
              </Button>
            </div>

            <div className={styles.loaderContainer}>
              <div className={`${styles.loader} ${!isMoveLoading && styles.hidden}`}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
