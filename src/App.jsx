import React from 'react';
import Canvas from './canvas/Canvas';
import { Circle, LineSegment, MathFunction } from './canvas/objects/ctx-drawables';
import Point from './canvas/objects/Point';

export default () => {
  return (
    <>
      <Canvas>
        {/* <LineSegment from={[1, -1]} to={[2, -1]} style={{ strokeStyle: 'yellow' }} /> */}

        <MathFunction func={Math.sin} style={{ strokeStyle: 'green' }} />

        {/* todo try draw it around A or B */}
        <Circle center={[0, 0]} radius={Math.SQRT2} style={{ strokeStyle: 'lightblue' }} />

        <Point location={[3, 1]} label="A" />
        <Point location={[2.5, 0]} label="B" />
        <Point location={[3, -1]} label="C" />

        <LineSegment from="A" to="B" style={{ strokeStyle: 'yellow' }} />
        <LineSegment from="B" to="C" style={{ strokeStyle: 'yellow' }} />
        <LineSegment from="C" to="A" style={{ strokeStyle: 'yellow' }} />
      </Canvas>
    </>
  );
};

// todo - Point should display a Msg_HasToBeCanvasChild if rendered outside the Canvas

// todo - Point should be given style instead of being always yellow