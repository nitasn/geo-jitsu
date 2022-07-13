import React from 'react';
import Canvas from './canvas/Canvas';
import {
  Circle,
  LineSegment,
  MathFunction,
  PerpendicularBisector,
} from './canvas/objects/ctx-drawables';
import Point from './canvas/objects/Point';

export default () => {
  return (
    <>
      <Canvas>
        {/* <LineSegment from={[1, -1]} to={[2, -1]} style={{ strokeStyle: 'yellow' }} /> */}

        {/* <MathFunction func={Math.sin} style={{ strokeStyle: 'green' }} /> */}

        {/* <Circle center="A" radius={1} style={{ strokeStyle: 'lightblue' }} /> */}

        {/* <Circle center={[0, 1]} passingThrough="B" style={{ strokeStyle: 'lightblue' }} /> */}

        <Point location={[-Math.PI / 2, 0]} label="A" />
        <Point location={[2, -1]} label="B" />
        {/* <Point location={[3, -1]} label="C" /> */}

        <LineSegment from="A" to="B" style={{ strokeStyle: 'yellow' }} />
        {/* <LineSegment from="B" to="C" style={{ strokeStyle: 'yellow' }} /> */}
        {/* <LineSegment from="C" to="A" style={{ strokeStyle: 'yellow' }} /> */}

        {/* todo bug - when no children other than a MathFun, it crashes */}

        <PerpendicularBisector left="A" right="B" style={{ strokeStyle: 'lightblue' }} />
      </Canvas>
    </>
  );
};

// todo - Point should display a Msg_HasToBeCanvasChild if rendered outside the Canvas

// todo - Point should be given style instead of being always yellow

// todo AngleBisector
