import {useEffect, useRef, useState} from "react";

import styles from "./ConnectFour.module.scss";
import Cell from "./Cell";
import Button from "components/common/Button";
import DropdownButton from "components/common/DropdownButton";

import Node from "models/connectFour/monteCarloTreeSearch";
import { getDeserializedModel, predict } from "models/connectFour/tensorflowUtils";
import modelStr16 from "models/connectFour/model.json";

const numSimulations = 50;

// TODO: create controlled component connect 4 board whose only purpose is to display the board
// Turn this component into ConnectFourSection, which contains board + buttons
export default function ConnectFour(props) {
  const { boardClasses } = props;

  // Use `setRenderKey(prev => !prev)` to re-render component. Used when game state changes.
  const [, setRenderKey] = useState(false);
  const gameRef = useRef({model: null, root: null});

  const [gameOverScore, setGameOverScore] = useState(null);
  const [hoveringCol, setHoveringCol] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef(1); // 1 if player goes first, 2 if player goes second

  // On mount, get neural network model
  useEffect(() => {
    setTimeout(() => {
      getDeserializedModel(JSON.stringify(modelStr16))
        .then(model => {
          gameRef.current.model = model;
          gameRef.current.root = new Node({
            predictFn: (node) => predict(node.state, model)
          });
          setRenderKey(prev => !prev);
        });
    }, 0);
  }, []);

  const makeAiMove = () => {
    for (let i = 0; i < numSimulations; ++i) gameRef.current.root.simulate();

    const action = gameRef.current.root.getMostVisitedAction();
    gameRef.current.root.doAction(action);

    if (gameRef.current.root.state.hasWon()) {
      setGameOverScore(-1);
      setHoveringCol(null);
      return;
    }
    if (gameRef.current.root.state.isFull()) {
      setGameOverScore(0);
      setHoveringCol(null);
      return;
    }
    setRenderKey(prev => !prev);    
  };

  // Create new game and ai
  const handleNewGame = () => {
    // TODO: add other models option
    gameRef.current.root = new Node({
      predictFn: (node) => predict(node.state, gameRef.current.model)
    });
    setRenderKey(prev => !prev);
    setGameOverScore(null);

    if (playerRef.current === 2) makeAiMove();
  };

  // Make move
  const handleColumnClick = (colIndex) => {
    if (!gameRef.current.root) return;

    // Make player move
    const moves = gameRef.current.root.state.getValidMoves();
    if (moves.indexOf(colIndex) < 0) return;
    
    const action = gameRef.current.root.actions.find(action => action.move === colIndex);
    gameRef.current.root.doAction(action);

    // Check if game is over
    if (gameRef.current.root.state.hasWon()) {
      setGameOverScore(1);
      setHoveringCol(null);
      return;
    }
    if (gameRef.current.root.state.isFull()) {
      setGameOverScore(0);
      setHoveringCol(null);
      return;
    }
    setRenderKey(prev => !prev);

    // Make ai move
    // TODO: move simulations to web worker
    setTimeout(makeAiMove, 0);
  };

  // Show move preview
  const handleHoverEnter = (colIndex) => {
    setHoveringCol(colIndex);
  };

  // Stop showing move preview
  const handleHoverLeave = () => {
    setHoveringCol(null);
  };

  return (
    <div className={`flex-direction-col align-items-center`}>
      <div
        className={`flex-direction-row padding-2 margin-vert-2 ${styles.container} ${boardClasses}`}
        onMouseLeave={handleHoverLeave}
      >
        {gameRef.current.root && gameRef.current.root.state.getBoard().map((column, colIndex) => (
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
                  rowIndex === gameRef.current.root.state.heights[colIndex] % 7 &&
                  gameRef.current.root.state.getCurrentPlayer()
                }
                containerClasses={`margin-1`}
              />
            ))}
          </div>
        ))}
        {gameOverScore !== null &&
          <div className={`flex-center ${styles.overlayContainer}`}>
            <div className={`font-size-4 padding-horz-2 ${styles.gameOverText}`}>
              {gameOverScore < 0 ? "You Lose" : gameOverScore === 0 ? "Draw" : "You Win!"}
            </div>
          </div>
        }
      </div>
      <div className={`justify-content-center margin-vert-1`}>
        <DropdownButton
          menuOptions={["Player 1", "Player 2"]}
          size={2}
          containerClasses="margin-horz-2 margin-vert-1"
          onChangeOptionIndex={index => playerRef.current = index + 1}
        />
        <Button text="New Game" size={2} onClick={handleNewGame} containerClasses="margin-horz-2 margin-vert-1" />
      </div>
    </div>
  );
}