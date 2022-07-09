import React from 'react';
import { toCanvasCoords } from './conversions';

function MsgHasToBeCanvasChild() {
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

export function LineSegment({ from, to }, ctx) {
  if (!(ctx instanceof CanvasRenderingContext2D)) return MsgHasToBeCanvasChild();

  ctx.beginPath();
  ctx.moveTo(...toCanvasCoords(from));
  ctx.lineTo(...toCanvasCoords(to));
  ctx.stroke();
}
