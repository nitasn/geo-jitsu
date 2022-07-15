import React from 'react';
import Canvas from './canvas/Canvas';
import {
  AngleBisector,
  Circle,
  LineSegment,
  MathFunction,
  PerpendicularBisector,
} from './canvas/drawables/ctx-drawables';
import Point from './canvas/drawables/Point';
import Menu from './menu/Menu';

export default () => {
  return (
    <>
      <Canvas>
        <Point location={[-1.25, 0]} label="A" />
        <Point location={[1, -1]} label="B" />
        <Point location={[2, 1]} label="C" />

        <LineSegment from="A" to="B" style={{ strokeStyle: 'yellow' }} />
        <LineSegment from="B" to="C" style={{ strokeStyle: 'yellow' }} />
        <LineSegment from="C" to="A" style={{ strokeStyle: 'yellow' }} />

        <AngleBisector
          left="A"
          middle="C"
          right="B"
          style={{ strokeStyle: 'lightgreen' }}
        />
        <PerpendicularBisector left="A" right="B" style={{ strokeStyle: 'lightblue' }} />

        <Circle center="A" radius={1} style={{ strokeStyle: 'lightblue' }} />
      </Canvas>

      <Menu />
    </>
  );
};

// todo - bug: when no children other than a MathFun, it crashes

// todo - Point should display a Msg_HasToBeCanvasChild if rendered outside the Canvas

// todo - Point should be given style instead of being always yellow

// todo - AngleBisector

// todo - add DependencePoint (e.g. MidPoint); not draggable by user, but labeled, and writes to the global 'objects'

const showOff = (
  <>
    <Canvas>
      <Point location={[-Math.PI / 2, 0]} label="A" />
      <Point location={[-0.5, 1.5]} label="B" />
      <Point location={[3, -1]} label="C" />

      <LineSegment from="A" to="B" style={{ strokeStyle: 'yellow' }} />
      <LineSegment from="B" to="C" style={{ strokeStyle: 'yellow' }} />
      <LineSegment from="C" to="A" style={{ strokeStyle: 'yellow' }} />

      <MathFunction func={Math.sin} style={{ strokeStyle: 'green' }} />

      <Circle center="A" radius={1} style={{ strokeStyle: 'lightblue' }} />

      {/* <Circle center={[0, 1]} passingThrough="B" style={{ strokeStyle: 'lightblue' }} /> */}
    </Canvas>
  </>
);
