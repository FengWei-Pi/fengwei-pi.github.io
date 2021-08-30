import styles from "./Cell.module.scss";

export default function Cell(props) {
  const { piece, hoverPiece, containerClasses } = props; 
  return (
    <div className={`
      flex-1
      ${styles.cell}
      ${containerClasses}
      ${piece === 0 && styles.red}
      ${piece === 1 && styles.blue}
      ${hoverPiece === 0 && styles.hoverRed}
      ${hoverPiece === 1 && styles.hoverBlue}
    `}>
    </div>
  );
}