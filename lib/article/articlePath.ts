// Module exports utility functions for articles
// import fitCurve from "fit-curve";

// An array of pre-generated bezier curves that look good visually on a square canvas.
// Each number is the percent of the max width and max height.
// TODO adjust path so they are mostly using the right side
// TODO adjust path so they always start and end in the middle of the edge and perpendicular to the edge.
const curves = [
  [
    [[0.6, 0], [0.68, 0.2], [0.91, 0.4], [0.84, 0.6]],
    [[0.84, 0.6], [0.79, 0.74], [0.55, 0.54], [0.4, 0.56]],
    [[0.4, 0.56], [0.26, 0.58], [0.13, 0.65], [0, 0.7]]
  ],
  [
    [[0.6, 0], [0.64, 0.22], [0.83, 0.46], [0.72, 0.65]],
    [[0.72, 0.65], [0.65, 0.77], [0.47, 0.45], [0.33, 0.46]],
    [[0.33, 0.46], [0.19, 0.47], [0.11, 0.62], [0, 0.7]]
  ],
  [
    [[0.72, 0], [0.69, 0.093], [0.624, 0.182], [0.63, 0.28]],
    [[0.63, 0.28], [0.638, 0.41], [0.763, 0.51], [0.76, 0.64]],
    [[0.76, 0.64], [0.759, 0.7], [0.675, 0.726], [0.62, 0.73]],
    [[0.62, 0.73], [0.414, 0.746], [0.21, 0.71], [0, 0.7]]
  ],
  [
    [[0.6, 0], [0.63, 0.533], [0.68, 0.533], [0, 0.6]]
  ],
  [
    [[0.6, 0], [0.56, 0.35], [0.62, 0.08], [0, 0.59]]
  ],
  [
    [[0.6, 0], [0.617, 0.21], [0.775, 0.461], [0.65, 0.63]],
    [[0.65, 0.63],[0.567, 0.741], [0.438, 0.39], [0.3, 0.405]],
    [[0.3, 0.405], [0.16, 0.42], [0.1, 0.602], [0,0.7]]
  ],
  [
    [[0.62, 0], [0.74, 0.14], [1.13, 0.53], [0.76, 0.75]],
    [[0.76, 0.75], [0.54, 0.88], [0.25, 0.72], [0, 0.7]]
  ],
  [
    [[0.55, 0], [0.76, 0.557], [0.62, 0.46], [0, 0.7]]
  ],
  [
    [[0.65, 0], [0.54, 0.27], [0.41, 0.44], [0, 0.68]]
  ],
  [
    [[0.4, 0], [0.29, 0.1], [0.07, 0.285], [0, 0.6]]
  ],
  [
    [[0.7, 0], [0.74, 0.06], [0.84, 0.12], [0.82, 0.19]],
    [[0.82, 0.19], [0.8, 0.26], [0.67, 0.24], [0.63, 0.31]],
    [[0.63, 0.31], [0.61, 0.35], [0.68, 0.4], [0.68, 0.45]],
    [[0.68, 0.45], [0.68, 0.48], [0.67, 0.51], [0.64, 0.52]],
    [[0.64, 0.52], [0.43, 0.58], [0.21, 0.61], [0, 0.65]]
  ]
];

/**
 * Returns an array of bezier curves that form a snaking 2D path from the top edge to the
 * left or right edge of a rectangle. Optionally provide the `toLeft` boolean to specify the target
 * edge (default true). The bezier curve coordinates range from 0 to 1, and can be scaled to
 * the desired dimensions.
 */
export const generateCurves = (toLeft=true) => {
  /* Random curve generation. Doesn't look good about 80% of the time.
  const randPoints: Array<Array<number>> = [];

  const generateRandPoint = () => (
    [
      Math.floor(Math.random()*(maxX-minX)) + minX,
      Math.floor(Math.random()*(maxY-minY)) + minY,
    ] as Array<number>
  );

  const numRandPoints = 2; // Math.floor(Math.random()*3) + 2;

  for (let i=0; i<numRandPoints; ++i) {
    randPoints.push(generateRandPoint());
  }

  const points = [
    [p1x, p1y],
    ...randPoints,
    [p2x, p2y]
  ];

  const bezierCurves: Array<Array<Array<number>>> = fitCurve(points, 100);
  return bezierCurves;
  */

  return curves[Math.floor(Math.random() * curves.length)].map(curve => (
    curve.map(coord => [toLeft ? coord[0] : coord[0] * -1 + 1, coord[1]])
  ));
};

/**
 * Returns an array of Path2D objects of the provided `bezierCurves`. Optionally scales
 * the curve by the provided scaling factor. Optionally draws only a `percent` of the full curve.
 */
export const getCurvePaths = (
  bezierCurves: Array<Array<Array<number>>>,
  options?: {
    scaleX?: number;
    scaleY?: number;
    percent?: number
  }
) => {
  const scaleX = options?.scaleX ?? 1;
  const scaleY = options?.scaleY ?? 1;
  const percent = options?.percent ?? 1;

  const curvePaths: Array<Path2D> = [];

  // TODO percent
  for (const curve of bezierCurves) {
    const cp1 = curve[1];
    const cp2 = curve[2];
    const p1 = curve[0];
    const p2 = curve[3];

    const curvePath = new Path2D();

    curvePath.moveTo(p1[0] * scaleX, p1[1] * scaleY);
    curvePath.bezierCurveTo(
      cp1[0] * scaleX,
      cp1[1] * scaleY,
      cp2[0] * scaleX,
      cp2[1] * scaleY,
      p2[0] * scaleX,
      p2[1] * scaleY
    );

    curvePaths.push(curvePath);
  }

  return curvePaths;
};

/** 
 * Returns a Path2D object of a large, stylized 'X', as in 'x marks the spot' on a pirate map.
 * Positions the top left corner of the 'x' at the provided `minX` and `minY` coordinate.
 * The provided `size` determines width and height.
 */
export const getCrossPath = (
  minX: number,
  minY: number,
  size: number,
) => {
  const capSize = size / 5;
  const lineSize = size / 2;

  const cross = new Path2D();

  // Top left
  cross.moveTo(minX + lineSize*9/10, minY + lineSize);
  cross.bezierCurveTo(
    minX + lineSize*4/10,
    minY + (capSize+lineSize/5),
    minX + lineSize/3,
    minY + (capSize+lineSize/10),
    minX,
    minY + capSize
  );
  cross.quadraticCurveTo(minX + capSize*2/3, minY + capSize*2/3, minX + capSize, minY);
  cross.bezierCurveTo(
    minX + (capSize+lineSize/10),
    minY + lineSize/3,
    minX + (capSize+lineSize/5),
    minY + lineSize*4/10,
    minX + lineSize,
    minY + lineSize*9/10
  );

  // Top right
  cross.bezierCurveTo(
    minX+size - (capSize+lineSize/5),
    minY + lineSize*4/10,
    minX+size - (capSize+lineSize/10),
    minY + lineSize/3,
    minX+size - capSize,
    minY
  );
  cross.quadraticCurveTo(minX+size - capSize*2/3, minY + capSize*2/3, minX+size, minY + capSize);
  cross.bezierCurveTo(
    minX+size - lineSize/3,
    minY + (capSize+lineSize/10),
    minX+size - lineSize*4/10,
    minY + (capSize+lineSize/5),
    minX+size - lineSize*9/10,
    minY + lineSize
  );

  // Bottom right
  cross.bezierCurveTo(
    minX+size - lineSize*4/10,
    minY+size - (capSize+lineSize/5),
    minX+size - lineSize/3,
    minY+size - (capSize+lineSize/10),
    minX+size,
    minY+size - capSize
  );
  cross.quadraticCurveTo(minX+size - capSize*2/3, minY+size - capSize*2/3, minX+size - capSize, minY+size);
  cross.bezierCurveTo(
    minX+size - (capSize+lineSize/10),
    minY+size - lineSize/3,
    minX+size - (capSize+lineSize/5),
    minY+size - lineSize*4/10,
    minX+size - lineSize,
    minY+size - lineSize*9/10
  );

  // Bottom left
  cross.bezierCurveTo(
    minX + (capSize+lineSize/10),
    minY+size - lineSize/3,
    minX + (capSize+lineSize/5),
    minY+size - lineSize*4/10,
    minX + capSize,
    minY+size
  );
  cross.quadraticCurveTo(minX + capSize*2/3, minY+size - capSize*2/3, minX, minY+size - capSize);
  cross.bezierCurveTo(
    minX + lineSize*4/10,
    minY+size - (capSize+lineSize/5),
    minX + lineSize/3,
    minY+size - (capSize+lineSize/10),
    minX + lineSize*9/10,
    minY+size - lineSize
  );

  return cross;
};
