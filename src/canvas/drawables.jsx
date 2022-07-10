import React from 'react';
import { useSelector } from 'react-redux';
import store from '../redux/store';
import {
  fromCanvasCoords,
  fromCanvasCoordX,
  fromCanvasDistance,
  toCanvasCoords,
  toCanvasCoordX,
  toCanvasCoordY,
  toCanvasDistance,
} from './conversions';

function Msg_HasToBeCanvasChild() {
  // get the name of the function who called us, using js trickery
  const compName = new Error().stack.match(/at (\S+)/g)[1].slice(3);

  console.warn(
    `"${compName}" has to be a Canvas child. Usage: \n` +
      `<Canvas> <${compName} {...props}/> </Canvas>`
  );

  return (
    <div
      style={{
        color: 'maroon',
        backgroundColor: '#ccc',
        paddingInline: 20,
        paddingBlock: 10,
        borderRadius: 4,
        width: 'fit-content',
        lineHeight: '3ex',
        margin: 25,
        boxShadow: '5px 5px 15px -3px rgba(0,0,0,0.36), inset 0 0 2px rgba(255,0,0,0.36)',
      }}
    >
      {compName} has to be a Canvas child. Usage:
      <pre>{`<Canvas> <${compName} {...props}/> </Canvas>`}</pre>
    </div>
  );
}

/**
 * @param {{ from: [number, number], to: [number, number] }}
 */
export function LineSegment({ from, to }, ctx) {
  if (!(ctx instanceof CanvasRenderingContext2D)) return Msg_HasToBeCanvasChild();

  ctx.beginPath();
  ctx.moveTo(...toCanvasCoords(from));
  ctx.lineTo(...toCanvasCoords(to));
  ctx.stroke();
}

/**
 * @param {{ func: (x: Number) => Number }}
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
export function Circle({ center, radius }, ctx) {
  if (!(ctx instanceof CanvasRenderingContext2D)) return Msg_HasToBeCanvasChild();

  const centerInCanv = toCanvasCoords(center);
  const radiusInCanv = toCanvasDistance(radius);

  ctx.beginPath();
  ctx.arc(...centerInCanv, radiusInCanv, 0, Math.PI * 2);
  ctx.stroke();
}
