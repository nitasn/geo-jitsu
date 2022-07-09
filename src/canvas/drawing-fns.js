import store from '../redux/store';
import {
  fromCanvasCoordX,
  fromCanvasDistance,
  toCanvasCoords,
  toCanvasCoordX,
  toCanvasCoordY,
  toCanvasDistance,
} from './conversions';

export function circle({ center, radius }) {
  return (ctx) => {
    const centerInCanv = toCanvasCoords(center);
    const radiusInCanv = toCanvasDistance(radius);

    ctx.beginPath();
    ctx.arc(...centerInCanv, radiusInCanv, 0, Math.PI * 2);
    ctx.stroke();
  };
}

export function point({ location, label }) {
  const RADIUS = 4.5;

  return (ctx) => {
    const [canvasX, canvasY] = toCanvasCoords(location);

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const x = canvasX + 7;
    const y = canvasY - 4;
    ctx.strokeText(label, x, y);
    ctx.fillText(label, x, y);
  };
}

export function lineSegment({ from, to }) {
  return (ctx) => {
    const canvasFrom = toCanvasCoords(from);
    const canvasTo = toCanvasCoords(to);

    ctx.beginPath();
    ctx.moveTo(...canvasFrom);
    ctx.lineTo(...canvasTo);
    ctx.stroke();
  };
}

/**
 * @param {(x: Number) => Number} func
 */
export function mathFunction(func) {
  const DELTA_X_PIXELS = 5;

  return (ctx) => {
    const { grid } = store.getState();

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
  };
}
