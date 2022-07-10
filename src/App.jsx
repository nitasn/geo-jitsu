import React from 'react';
import Canvas from './canvas/Canvas';
import { Circle, LineSegment, MathFunction } from './canvas/drawables';
import Point from './canvas/Point';

export default () => {
  return (
    <>
      <Canvas>
        <LineSegment from={[1, -1]} to={[2, -1]} style={{ strokeStyle: 'yellow' }} />

        <MathFunction func={Math.sin} style={{ strokeStyle: 'green' }} />

        <Circle center={[0, 0]} radius={Math.SQRT2} style={{ strokeStyle: 'darkblue' }} />

        <Point location={[3, 1]} label="A" />
      </Canvas>
    </>
  );
};
