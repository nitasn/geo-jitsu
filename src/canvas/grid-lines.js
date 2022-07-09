import { clamp } from '../math-utils';
import { ceilToNextMultiple, RoundToDecPlaces } from '../math-utils';
import { revertablyAssign } from '../utils';

/**
 * todo
 * mark numbers on axes should go rtl or ltr 
 */

import {
  toCanvasCoords,
  fromCanvasCoords,
  toCanvasCoordX,
  toCanvasCoordY,
  fromCanvasCoordX,
  fromCanvasCoordY,
} from './conversions';

import store from '../redux/store';

function _drawLine(ctx, [x1, y1], [x2, y2]) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/**
 * draw a line every `units` world units.
 * or in other words, for all k values, draw the lines
 * x = k * units
 * y = k * units
 */
function _drawLinesAtMultipleOf(grid, ctx, units, styles) {
  const step = grid.pixelsPerUnit * units;

  let [nextTickX, nextTickY] = fromCanvasCoords([0, 0]);

  [nextTickX, nextTickY] = toCanvasCoords([
    ceilToNextMultiple(nextTickX, units),
    ceilToNextMultiple(nextTickY, units),
  ]);

  const revertCtxStyles = revertablyAssign(ctx, styles);

  for (; nextTickX <= grid.width; nextTickX += step) {
    _drawLine(ctx, [nextTickX, 0], [nextTickX, grid.height]);
  }

  for (; nextTickY <= grid.height; nextTickY += step) {
    _drawLine(ctx, [0, nextTickY], [grid.width, nextTickY]);
  }

  revertCtxStyles();
}

function _drawTheAxes(grid, ctx, styles) {
  const [canvas_x, canvas_y] = toCanvasCoords([0, 0]);

  const revertCtxStyles = revertablyAssign(ctx, styles);

  _drawLine(ctx, [canvas_x, 0], [canvas_x, grid.height]);

  _drawLine(ctx, [0, canvas_y], [grid.width, canvas_y]);

  revertCtxStyles();
}

function _drawMarksNumbers(grid, ctx, marks, styles) {
  const revertCtxStyles = revertablyAssign(ctx, styles);

  const [leftmostX, upmostY] = fromCanvasCoords([0, 0]);

  const [originX, originY] = toCanvasCoords([0, 0]);

  const atY = clamp(14, originY, grid.height - 2);
  let x = toCanvasCoordX(ceilToNextMultiple(leftmostX, marks));
  while (x < grid.width) {
    let value = fromCanvasCoordX(x);
    value = RoundToDecPlaces(value, 5);
    ctx.fillText(value, x, atY);
    x += grid.pixelsPerUnit * marks;
  }

  const atX = clamp(2, originX, grid.width - 12);
  let y = toCanvasCoordY(ceilToNextMultiple(upmostY, marks));
  while (y < grid.height) {
    let value = fromCanvasCoordY(y);
    value = RoundToDecPlaces(value, 5);
    ctx.fillText(value, atX, y);
    y += grid.pixelsPerUnit * marks;
  }

  revertCtxStyles();
}

export function drawGridLines(ctx) {
  const { grid } = store.getState();

  /** how many parts to divide the major marks into upon break (must be > 1) */
  const base = 2;

  /** the smaller, the more fine the marks will be (and the break will happen sonner) */
  const MinPixelGap = 20;

  // to calculate minorMarks (distance between adjecent gridlines, in world units),
  // find the lowest whole `power` that satisfies the following inequation:
  // pixelsPerUnit * (base ^ power) >= MinPixelGap
  // base ^ power >= MinPixelGap / pixelsPerUnit
  // power >= log(MinPixelGap/pixelsPerUnit) / log(base)
  // power = ceil( log(MinPixelGap/pixelsPerUnit) / log(base) )
  // finally, minorMarks = (base ^ power)
  const power = Math.ceil(Math.log(MinPixelGap / grid.pixelsPerUnit) / Math.log(base));

  /** distance between adjecent gridlines, in world units */
  const minorMarks = base ** power;

  const majorMarks = minorMarks * 4;

  _drawLinesAtMultipleOf(grid, ctx, minorMarks, {
    strokeStyle: 'rgb(56, 54, 54)',
  });

  // strengthen every fourth line
  _drawLinesAtMultipleOf(grid, ctx, majorMarks, {
    strokeStyle: 'rgb(61, 61, 66)',
  });

  _drawTheAxes(grid, ctx, { strokeStyle: 'rgb(111, 111, 111)' });

  _drawMarksNumbers(grid, ctx, majorMarks, {
    fillStyle: 'rgb(100, 100, 100)',
    font: '14px Courier New MS',
  });
}

/*

todo encaosulate the 

  const revertCtxStyles = revertablyAssign(ctx, styles);
  ...
  revertCtxStyles();

trick in a function:

  withCtx((ctx) => { 
    ...
  }, styles)

*/
