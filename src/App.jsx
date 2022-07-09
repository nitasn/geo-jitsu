import React from 'react';
import Canvas from './canvas/Canvas';
import { LineSegment } from './canvas/drawables';
import { circle, lineSegment, mathFunction, point } from './canvas/drawing-fns';

export default () => {
  return (
    <>
      <Canvas>
        <LineSegment from={[1, -1]} to={[2, -1]} style={{ strokeStyle: 'green' }} />
      </Canvas>
    </>
  );
};

function Point({ location, label }) {
  const [canvasX, canvasY] = toCanvasCoords(location);

  return (
    <div
      id="point"
      style={{
        width: 5,
        height: 5,
        backgroundColor: 'yellow',
        border: '1px solid black',
        borderRadius: '100%',
        position: 'absolute',
        left: 40 || canvasX,
        top: 40 || canvasY,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <p style={{ position: 'absolute', left: 6 }}>{label}</p>
    </div>
  );
}
