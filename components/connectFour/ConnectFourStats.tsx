import styles from "./ConnectFourStats.module.scss";

/** Controlled component that displays the Connect Four move history and statistics. */
export const ConnectFourStats = (props: {
  pastMoves?: Array<number>;
  evaluation?: {
    /** Number from 0 to 1, for the given player's perspective */
    winPercent: number;
    player: 1 | 2
  };
  /** Name of first player */
  player1?: string;
  /** Name of second player */
  player2?: string;
  /** The best next moves according to the computer. */
  prediction?: Array<number>;
  predictionEnd?: {
    end: "loss" | "win" | "draw" | "ongoing";
    player: 1 | 2;
  }
}) => {
  const player1 = props.player1 ?? "Player One";
  const player2 = props.player2 ?? "Player Two";

  let evaluationString = "";
  if (props.evaluation !== undefined) {
    const winPercent = props.evaluation.winPercent;
    const player = props.evaluation.player === 1 ? player1 : player2;

    if (winPercent <= 0.1) evaluationString = `${player} strongly unfavored`;
    else if (winPercent <= 0.25) evaluationString = `${player} unfavored`;
    else if (winPercent <= 0.4) evaluationString = `${player} slightly unfavored`;
    else if (winPercent <= 0.6) evaluationString = "Even";
    else if (winPercent <= 0.75) evaluationString = `${player} slightly favored`;
    else if (winPercent <= 0.9) evaluationString = `${player} favored`;
    else evaluationString = `${player} strongly favored`;
  }

  const predictionPlayer = props.predictionEnd?.player === 1 ? player1 : player2;
  const predictionEndString = props.predictionEnd?.end === "ongoing" ?
    ", ..." :
    ` (${predictionPlayer} ${props.predictionEnd?.end})`;

  return (
    <div className={styles.container}>
      {props.prediction !== undefined && props.prediction.length > 0 && (
        <div className={styles.predictionContainer}>
          Computer Search: {" "}
          {props.prediction.map((move, index) => 
            move + (index < props.prediction!.length-1 ? ", " : "")
          )}
          {props.predictionEnd !== undefined && predictionEndString}
        </div>
      )}

      {props.evaluation !== undefined && (
        <div className={styles.evaluationContainer}>
          Computer Evaluation: {" "}
          {evaluationString + " (" + Math.round(props.evaluation.winPercent * 100) + "%)"}
        </div>
      )}

      <div className={styles.playersLabelContainer}>
        <div className={styles.playerOneLabel}>
          {player1}
        </div>
        <div className={styles.playerTwoLabel}>
          {player2}
        </div>
      </div>

      <div className={styles.movesContainer}>
        <div className={styles.playerOneMovesContainer}>
          {props.pastMoves?.map((move, index) => (
            index % 2 === 0 ? (
              <div key={index.toString()} className={styles.moveText}>
                {move}
              </div>
            ) : null
          ))}
        </div>
        
        <div className={styles.playerTwoMovesContainer}>
          {props.pastMoves?.map((move, index) => (
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
