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

import Msg_HasToBeCanvasChild from './drawable-err-msg';

/**
 * @param {{ from: string | [number, number], to: string | [number, number], style?: object|undefined }}
 */
export function LineSegment({ from, to }, ctx, objects) {
  if (!(ctx instanceof CanvasRenderingContext2D)) return Msg_HasToBeCanvasChild();

  if (typeof from === 'string') {
    from = objects[from];
  }
  if (typeof to === 'string') {
    to = objects[to];
  }

  if (!from || !to)
    return console.warn('LineSegment draw failed: param `from` or `to` is unset');

  ctx.beginPath();
  ctx.moveTo(...toCanvasCoords(from));
  ctx.lineTo(...toCanvasCoords(to));
  ctx.stroke();
}

/**
 * @param {{ func: (x: Number) => Number, style?: object|undefined }}
 */
export function MathFunction({ func }, ctx) {
  if (!(ctx instanceof CanvasRenderingContext2D)) return Msg_HasToBeCanvasChild();

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
 * @param {{ center: [number, number], radius: number, style?: object|undefined }}
 */
export function Circle({ center, radius }, ctx, objects) {
  if (!(ctx instanceof CanvasRenderingContext2D)) return Msg_HasToBeCanvasChild();

  if (typeof center === 'string') {
    center = objects[center];
  }

  const centerInCanv = toCanvasCoords(center);
  const radiusInCanv = toCanvasDistance(radius);

  ctx.beginPath();
  ctx.arc(...centerInCanv, radiusInCanv, 0, Math.PI * 2);
  ctx.stroke();
}