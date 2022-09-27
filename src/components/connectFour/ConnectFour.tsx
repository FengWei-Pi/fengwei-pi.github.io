import { useEffect, useRef, useState, useMemo } from "react";

import styles from "./ConnectFour.module.scss";
import Cell from "./Cell";
import Button from "components/common/Button";
import DropdownButton from "components/common/DropdownButton";

import { ConnectFourController } from "models/connectFour/connectFourController";
import { ConnectFourNNStrategyMultiThread } from "models/connectFour/connectFourNNStrategyMultiThread";
import { TerminalValue } from "models/turnGame/model";
import { ConnectFourBoard } from "models/connectFour/connectFourBoard";

// TODO: create controlled component connect 4 board whose only purpose is to display the board
// Turn this component into ConnectFourSection, which contains board + buttons
export default function ConnectFour(props) {
  const { boardClasses } = props;

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
      board,
      heights
    };
  }, [game]);

  return (
    <div className={`flex-direction-col align-items-center`}>
      <div
        className={`flex-direction-row padding-2 margin-vert-2 ${styles.container} ${boardClasses}`}
        onMouseLeave={handleHoverLeave}
      >
        {board.board.map((column, colIndex) => (
          <div
            className={`flex-direction-col-reverse ${styles.column}`} key={colIndex.toString()}
            onMouseEnter={() => handleHoverEnter(colIndex)}
            onClick={() => handleColumnClick(colIndex)}
          >
            {column.map((piece, rowIndex) => (
              <Cell
                key={rowIndex}
                piece={piece}
                hoverPiece={
                  colIndex === hoveringCol &&
                  rowIndex === board.heights[colIndex] &&
                  game?.getCurrentPlayer() === playerIndexRef.current &&
                  playerIndexRef.current
                }
                containerClasses={`margin-1`}
              />
            ))}
          </div>
        ))}
        {terminalValue != null &&
          <div className={`flex-center ${styles.overlayContainer}`}>
            <div className={`font-size-4 padding-horz-2 ${styles.gameOverText}`}>
              {terminalValue === TerminalValue.Loss ?
                "You Lose" :
                terminalValue === TerminalValue.Draw ?
                  "Draw" :
                  terminalValue === TerminalValue.Win &&
                  "You Win!"
              }
            </div>
          </div>
        }
      </div>
      <div className={`justify-content-center margin-vert-1`}>
        <DropdownButton
          menuOptions={["Player 1", "Player 2"]}
          size={2}
          containerClasses="margin-horz-2 margin-vert-1"
          onChangeOptionIndex={index => playerIndexRef.current = index}
        />
        <Button
          text="New Game"
          size={2}
          onClick={handleNewGamePress}
          containerClasses={"margin-horz-2 margin-vert-1"}
        />
      </div>
    </div>
  );
}