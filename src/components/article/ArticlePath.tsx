import { useRef, useLayoutEffect } from "react";

import { generateCurves, getCurvePaths } from "../../utils/pathUtils";
import styles from "./ArticlePath.module.scss";

/**
 * Canvas element that draws a path between `article1` and `article2`. Requires `article1`
 * and this element to have the same non-statically positioned ancestor.
 */
export const ArticlePath = (props: {
  article1: HTMLElement,
  article2: HTMLElement,
  /** If path should be drawn to left edge. */
  toLeft?: boolean;
}) => {
  const { article1, article2, toLeft } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const curvesRef = useRef(generateCurves(toLeft));
  const animationHandleRef = useRef<number>();
  const animationPercent = useRef(0);

  useLayoutEffect(() => {
    const update = () => {
      // On every animation frame
      animationHandleRef.current = requestAnimationFrame(() => {
        if (canvasRef.current === null) {
          animationHandleRef.current = requestAnimationFrame(update);
          return;
        }

        // Update the canvases position and dimension based on those of `article1` and `article2`
        const article1Rect = article1.getBoundingClientRect();
        const article2Rect = article2.getBoundingClientRect();

        const newWidth = Math.floor(Math.max(
          article1.offsetWidth,
          toLeft ?
            Math.abs(article2Rect.right - article1Rect.right) :
            Math.abs(article2Rect.left - article1Rect.left)
        ));
        const newHeight = Math.floor(article2Rect.bottom - article1Rect.bottom);

        let didDimensionChange = false;

        if (canvasRef.current.width !== newWidth || canvasRef.current.height !== newHeight) {
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
          canvasRef.current.style.width = newWidth + "px";
          canvasRef.current.style.height = newHeight + "px";

          // Setting the width or height clears the canvas, so a redraw is needed
          didDimensionChange = true;
        } 

        canvasRef.current.style.top = article1.offsetTop + article1.offsetHeight + "px";
        canvasRef.current.style.left = Math.min(
          article1.offsetLeft,
          article1.offsetLeft + article2Rect.right - article1Rect.left
        ) + "px";

        // If path needs to be redrawn
        if (didDimensionChange || animationPercent.current === 0) {
          // Draw path
          const ctx = canvasRef.current.getContext("2d");
          if (ctx === null) return;

          ctx.strokeStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--secondary-color")})`;
          ctx.lineWidth = 6;
          ctx.setLineDash([16, 10]);

          const curvePaths = getCurvePaths(curvesRef.current, {
            scaleX: canvasRef.current.width,
            scaleY: canvasRef.current.height
          });

          for (const path of curvePaths) {
            ctx.stroke(path);
          }

          animationPercent.current = 1; // TODO animation
        }

        animationHandleRef.current = requestAnimationFrame(update);
      }); 
    };

    if (canvasRef.current !== null) update();

    return () => {
      if (animationHandleRef.current !== undefined) {
        cancelAnimationFrame(animationHandleRef.current);
        animationHandleRef.current = undefined;
      }
    };
  }, [article1, article2, toLeft]);

  return(
    <canvas ref={canvasRef} width={0} height={0} className={styles.canvas} />
  );
};
