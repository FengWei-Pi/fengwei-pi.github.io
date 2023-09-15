import { useState, useCallback, useLayoutEffect } from "react";

import { Cell } from "./Cell";
import styles from "./ConnectFourBoard.module.scss";

export const NUM_ROWS = 6;
export const NUM_COLS = 7;

/**
 * Controlled component that renders a 7 by 6 Connect Four Board.
 * Reponsive in the width direction (Height will always match its size to width).
 */
export const ConnectFourBoard = (props: {
  /** 
   * 7x6 array of number representing the board, where (0, 0) is the bottom left,
   * and (7, 0) is the bottom right. Array element 0 is one colour, element 1 is another.
   */
  grid: Array<Array<number>>;
  onColumnPress: (colIndex: number) => void;
  className?: string;
  /**
   * 0 or 1.
   * Shows the piece move preview if user hovers over a column
   */
  showHoverPlayer?: number;
  isLoading?: boolean;
  isEnd?: "win" | "loss" | "draw";
}) => {
  // Used to show move preview
  const [hoveringCol, setHoveringCol] = useState(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);

  const setContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (el === null) return;
    setContainerElement(el);
  }, []);

  // Set the board's height to the correct ratio of the width
  useLayoutEffect(() => {
    if (containerElement === null) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.borderBoxSize && entry.borderBoxSize[0]) {
          const el = entry.target as HTMLDivElement;

          // 20px counteracts the effect of cells appearing 'flatter' due to board padding
          // 30px accommodates column subtext height
          el.style.height = entry.contentRect.width * NUM_ROWS/NUM_COLS + 20 + 30 + "px";
        }
      }
    });

    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerElement]);

  if (props.grid.length !== NUM_COLS) throw new Error(`Invalid Connect Four row length ${props.grid.length}`);

  const handleHoverEnter = (colIndex) => {
    setHoveringCol(colIndex);
  };

  const handleHoverLeave = () => {
    setHoveringCol(null);
  };

  return (
    <div
      className={`${styles.boardContainer} ${props.className}`}
      onMouseLeave={handleHoverLeave}
      ref={setContainerRef}
    >
      {props.grid.map((column, colIndex) => {
        if (column.length !== NUM_ROWS) throw new Error(`Invalid Connect Four column length ${column.length}`);

        return (
          <div key={colIndex.toString()} className={styles.column}>
            <button
              className={styles.columnButton}
              onMouseEnter={() => handleHoverEnter(colIndex)}
              onClick={() => props.onColumnPress(colIndex)}
            >
              {column.map((piece, rowIndex) => (
                <Cell
                  key={rowIndex}
                  piece={piece}
                  hoverPiece={
                    (
                      (props.showHoverPlayer === 0 || props.showHoverPlayer === 1) &&
                      colIndex === hoveringCol &&
                      column[rowIndex] !== 0 &&
                      column[rowIndex] !== 1 &&
                      (rowIndex + 1 === NUM_ROWS || (
                        rowIndex + 1 < NUM_ROWS &&
                        column[rowIndex + 1] !== 0 &&
                        column[rowIndex + 1] !== 1
                      )) && (
                        rowIndex === 0 ||
                        column[rowIndex - 1] === 0 || 
                        column[rowIndex - 1] === 1
                      )
                    ) !== false ? props.showHoverPlayer : undefined
                  }
                  className={styles.cell}
                />
              ))}
            </button>
            <div className={styles.columnSubtext}>
              {(colIndex + 1).toString()}
            </div>
          </div>
        );
      })}
      
      {props.isEnd !== undefined &&
          <div className={styles.overlayContainer}>
            <div className={styles.gameOverText}>
              {props.isEnd === "loss" ?
                "You Lose" :
                props.isEnd === "draw" ?
                  "Draw" :
                  props.isEnd === "win" &&
                  "You Win!"
              }
            </div>
          </div>
      }
    </div>
  );
};

