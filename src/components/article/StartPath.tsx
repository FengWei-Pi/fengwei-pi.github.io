import { useRef, useLayoutEffect } from "react";

import { getCurvePaths, getCrossPath } from "utils/pathUtils";
import styles from "./StartPath.module.scss";

/**
 * Canvas element that draws an 'X' and a path from `title` to `article1`. The canvas
 * width is partly based on `article2`. The path is transparent from the start until
 * the bottom edge of `titleContainer`.
 * 
 * Both this component and `title` should have `titleContainer` as the non-statically
 * positioned ancestor.
 */
export const StartPath = (props: {
  title: HTMLElement,
  titleContainer: HTMLElement,
  article1: HTMLElement,
  article2: HTMLElement
}) => {
  const { title, titleContainer, article1, article2 } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
      
        const ctx = canvasRef.current.getContext("2d");
        if (ctx === null) return;

        // Update canvas dimension based on the header and first two articles
        const titleContainerRect = titleContainer.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const article1Rect = article1.getBoundingClientRect();
        const article2Rect = article2.getBoundingClientRect();

        // 50px added to prevent being cut off by header layout.
        // TODO header layout should be changed to no longer need this extra 50px
        const newWidth = Math.floor(article2Rect.right - article1Rect.left + 50);
        const newHeight = Math.floor((article1Rect.bottom + article1Rect.top) / 2 - titleRect.top);

        let didDimensionChange = false;

        if (canvasRef.current.width !== newWidth || canvasRef.current.height !== newHeight) {
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
          canvasRef.current.style.width = newWidth + "px";
          canvasRef.current.style.height = newHeight + "px";
          didDimensionChange = true;
        }

        canvasRef.current.style.left = article1Rect.left - titleContainerRect.left + "px";
        canvasRef.current.style.top = titleRect.top - titleContainerRect.top + "px";

        if (didDimensionChange || animationPercent.current === 0) {
          ctx.save();
          const clipPath = new Path2D();

          // Set 'x' and everything below the header as clip path
          ctx.fillStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--on-surface-color")})`;

          const crossMinX = titleRect.right - article1Rect.left + title.offsetHeight / 4;
          const crossMinY = title.offsetHeight / 4;
          const crossSize = title.offsetHeight / 2;

          clipPath.addPath(getCrossPath(crossMinX, crossMinY, crossSize));

          const bottomRectPath = new Path2D();
          const headerBottom = titleContainer.getBoundingClientRect().bottom - titleRect.top;
          bottomRectPath.rect(0, headerBottom, canvasRef.current.width, canvasRef.current.height);

          clipPath.addPath(bottomRectPath);
          ctx.clip(clipPath);

          // Draw black for 'x'
          ctx.fillStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--on-surface-color")})`;
          ctx.fillRect(0, 0, canvasRef.current.width, crossMinY + crossSize);

          // Draw path from 'x' to first article. Path is clipped to only below header
          const curves = [
            [
              [(crossMinX + crossSize/2) / canvasRef.current.width, (crossMinY + crossSize + 10) / canvasRef.current.height],
              [(crossMinX + crossSize/2) / canvasRef.current.width, 0.58],
              [(crossMinX + crossSize*2) / canvasRef.current.width, 0.72],
              [Math.min(0.5, article1.offsetWidth / canvasRef.current.width), 1]
            ]
          ];

          ctx.strokeStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--secondary-color")})`;
          ctx.lineWidth = 6;
          ctx.setLineDash([16, 10]);

          const curvePaths = getCurvePaths(curves, {
            scaleX: canvasRef.current.width,
            scaleY: canvasRef.current.height
          });
          for (const path of curvePaths) {
            ctx.stroke(path);
          }

          // Set new clip to only below 'x' and above header
          ctx.restore();
          const topRectPath = new Path2D();
          topRectPath.rect(0, crossMinY + crossSize, canvasRef.current.width, headerBottom - crossMinY - crossSize);
          ctx.clip(topRectPath);

          // Draw path from 'x' to first article, with opacity style. Path is clipped to only above header
          ctx.strokeStyle = `rgba(${getComputedStyle(document.documentElement).getPropertyValue("--on-surface-color")}, 0.1)`;
          ctx.lineWidth = 6;
          ctx.setLineDash([16, 10]);
          for (const path of curvePaths) {
            ctx.stroke(path);
          }
          
          animationPercent.current = 1; // TODO animation
        }

        animationHandleRef.current = requestAnimationFrame(update);
      });
    };

    if (canvasRef.current !== null) {
      update();
    }

    return () => {
      if (animationHandleRef.current !== undefined) {
        cancelAnimationFrame(animationHandleRef.current);
        animationHandleRef.current = undefined;
      }
    };
  }, [title, titleContainer, article1, article2]);

  return(
    <canvas ref={canvasRef} width={0} height={0} className={styles.canvas} />
  );
};
