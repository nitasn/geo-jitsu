import {
  distance,
  vecAbs,
  vecAdd,
  vecDot,
  vecSub,
} from '../../math-utils';
import store from '../../redux/store';
import {
  fromCanvasCoords,
  fromCanvasCoordX,
  fromCanvasDistance,
  toCanvasCoords,
  toCanvasCoordX,
  toCanvasCoordY,
  toCanvasDistance,
} from '../conversions';

// todo dry the "if (typeof to === 'string') to = points[to];" thing out
//  and also why am i passing the points global state all over the place?

/**
 * @param {{
 *   from: string | [number, number],
 *   to: string | [number, number],
 *   style?: object
 * }}
 * @param {CanvasRenderingContext2D} ctx passed by an effect of the Canvas
 * @param {object} points a slice of the global state, notably - where each labeled point is
 */
export function LineSegment({ from, to }, ctx, points) {
  if (typeof from === 'string') {
    from = points[from];
  }
  if (typeof to === 'string') {
    to = points[to];
  }

  if (!from || !to)
    return console.warn('LineSegment draw failed: param `from` or `to` is unset');

  ctx.beginPath();
  ctx.moveTo(...toCanvasCoords(from));
  ctx.lineTo(...toCanvasCoords(to));
  ctx.stroke();
}

/**
 * @param {{
 *   func: (x: Number) => Number
 *   style?: object
 * }}
 * @param {CanvasRenderingContext2D} ctx passed by an effect of the Canvas
 */
export function MathFunction({ func }, ctx) {
  const { grid } = store.getState();

  const DELTA_X_PIXELS = 5;

  const fromWorldX = fromCanvasCoordX(0);
  const worldStep = fromCanvasDistance(DELTA_X_PIXELS);

  ctx.beginPath();
  ctx.moveTo(0, toCanvasCoordY(func(fromWorldX)));
  let worldX = fromWorldX + worldStep;
  let canvX = DELTA_X_PIXELS;
  while (canvX <= grid.width) {
    const worldY = func(worldX);
    const canvY = toCanvasCoordY(worldY);
    ctx.lineTo(canvX, canvY);
    worldX += worldStep;
    canvX += DELTA_X_PIXELS;
  }
  ctx.stroke();
}

/**
 * @param {{
 *   center: [number, number],
 *   radius?: number,
 *   passingThrough?: string | [number, number]
 *   style?: object
 * }}
 * @param {CanvasRenderingContext2D} ctx passed by an effect of the Canvas
 * @param {object} points a slice of the global state, notably - where each labeled point is
 */
export function Circle({ center, radius, passingThrough }, ctx, points) {
  if (passingThrough != undefined && radius != undefined) {
    return console.error(
      'Circle must be given either a `passingThrough` or a `radius` prop'
    );
  }

  if (typeof center === 'string') {
    center = points[center];
  }

  if (!center) return console.warn('Circle draw failed: param `passingThrough` is unset');

  if (typeof passingThrough === 'string') {
    passingThrough = points[passingThrough];

    if (!passingThrough)
      return console.warn('Circle draw failed: param `passingThrough` is unset');
  }

  if (passingThrough) {
    // by now it should be a [number, number] tuple in world coords
    radius = distance(center, passingThrough);
  }

  const centerInCanv = toCanvasCoords(center);
  const radiusInCanv = toCanvasDistance(radius);

  ctx.beginPath();
  ctx.arc(...centerInCanv, radiusInCanv, 0, Math.PI * 2);
  ctx.stroke();
}

function midPoint([x1, y1], [x2, y2]) {
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

function slope([x1, y1], [x2, y2]) {
  return (y1 - y2) / (x1 - x2);
}

export function PerpendicularBisector({ left, right }, ctx, points) {
  if (typeof left === 'string') {
    left = points[left];
  }
  if (typeof right === 'string') {
    right = points[right];
  }

  if (!left || !right)
    return console.warn('LineSegment draw failed: param `left` or `right` is unset');

  const [vx, vy] = vecSub(right, left);
  const u = [-vy, vx]; // 90° anticlosckwise rotation

  const mid = midPoint(left, right);
  const to = vecAdd(mid, u);

  return _wholeScreenStretchingLineSegment({ from: mid, to }, ctx);
}

export function AngleBisector({ left, middle, right }, ctx, points) {
  const { grid } = store.getState();

  if (typeof left === 'string') {
    left = points[left];
  }
  if (typeof right === 'string') {
    right = points[right];
  }
  if (typeof middle === 'string') {
    middle = points[middle];
  }

  const [A, B] = [vecSub(left, middle), vecSub(right, middle)];

  // C = A |B| + B |A|
  const C = vecAdd(vecDot(A, vecAbs(B)), vecDot(B, vecAbs(A)));
  const to = vecAdd(C, middle);

  return _wholeScreenStretchingLineSegment({ from: middle, to }, ctx);
}

function _wholeScreenStretchingLineSegment({ from, to }, ctx) {
  const { grid } = store.getState();

  const [canvFromX, canvFromY] = toCanvasCoords(from);

  // special case: parallel to y axis
  if (from[0] == to[0]) {
    // todo accomedate for float-error by epsilon of half a pixel
    ctx.beginPath();
    ctx.moveTo(canvFromX, canvFromY);
    ctx.lineTo(toCanvasCoordX(to[0]), 0);
    ctx.moveTo(canvFromX, canvFromY);
    ctx.lineTo(toCanvasCoordX(to[0]), grid.height);
    ctx.stroke();
    return;
  }

  ctx.beginPath();

  const m = slope(from, to);
  const [x1, y1] = from;

  for (const edgeX of [grid.width, 0]) {
    const x = fromCanvasCoordX(edgeX);
    const y = m * (x - x1) + y1;

    ctx.moveTo(canvFromX, canvFromY);
    ctx.lineTo(edgeX, toCanvasCoordY(y));
  }

  ctx.stroke();
}
