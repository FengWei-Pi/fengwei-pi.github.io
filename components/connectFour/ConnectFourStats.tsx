import styles from "./ConnectFourStats.module.scss";

/** Controlled component that displays the Connect Four move history and statistics. */
export const ConnectFourStats = (props: {
  pastMoves: Array<number>;
  /** Number from -1 to 1. 1 favours the first player, -1 the second, 0 is a draw. */
  evaluation?: number;
  /** The best next moves according to the computer. */
  prediction?: Array<number>;
}) => {
  let evaluationString = "";
  if (props.evaluation !== undefined) {
    if (props.evaluation <= -0.9) evaluationString = "Player 2 Strongly Favored";
    else if (props.evaluation <= -0.4) evaluationString = "Player 2 Favored";
    else if (props.evaluation <= -0.1) evaluationString = "Player 2 Slightly Favored";
    else if (props.evaluation <= 0.1) evaluationString = "Equal";
    else if (props.evaluation <= 0.4) evaluationString = "Player 1 Slightly Favored";
    else if (props.evaluation <= 0.9) evaluationString = "Player 1 Favored";
    else evaluationString = "Player 1 Strongly Favored";
  }

  return (
    <div className={styles.container}>
      {props.prediction !== undefined && (
        <div className={styles.predictionContainer}>
          Computer Search: {" "}
          {props.prediction.map(move => move + ", ")}
        </div>
      )}

      {props.evaluation !== undefined && (
        <div className={styles.evaluationContainer}>
          {evaluationString + " (" + props.evaluation + ")"}
        </div>
      )}

      <div className={styles.movesContainer}>
        <div className={styles.playerOneMovesContainer}>
          Player 1
          {props.pastMoves.map((move, index) => (
            index % 2 === 0 ? (
              <div key={index.toString()} className={styles.moveText}>
                {move}
              </div>
            ) : null
          ))}
        </div>
        
        <div className={styles.playerTwoMovesContainer}>
          Player 2
          {props.pastMoves.map((move, index) => (
            index % 2 === 1 ? (
              <div key={index.toString()} className={styles.moveText}>
                {move}
              </div>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
};
