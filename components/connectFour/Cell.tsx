import styles from "./Cell.module.scss";

export default function Cell(props) {
  const { piece, hoverPiece, className } = props; 
  return (
    <div className={`
      ${styles.cell}
      ${className}
      ${piece === 0 && styles.red}
      ${piece === 1 && styles.blue}
      ${hoverPiece === 0 && styles.hoverRed}
      ${hoverPiece === 1 && styles.hoverBlue}
    `}>
    </div>
  );
}
