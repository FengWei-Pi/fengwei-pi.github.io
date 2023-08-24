import styles from "./Cell.module.scss";

export const Cell = (props: {
  /** 0 or 1 */
  piece?: number;
  /** 0 or 1 */
  hoverPiece?: number;
  className?: string;
}) => {
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
};
