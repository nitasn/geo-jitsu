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
        <Point location={[0.5, -1]} label="A" />
        <Point location={[3, 2]} label="B" />

        <LineSegment from="A" to="B" style={{ strokeStyle: 'yellow' }} />
        <Circle center='A' radius={1} style={{ strokeStyle: 'lightblue' }} />
      </Canvas>

      <Menu />
    </>
  );
};

// todo - Point should display a Msg_HasToBeCanvasChild if rendered outside the Canvas

// todo - Point should be given style instead of being always yellow

// todo - add DependencePoint (e.g. MidPoint); not draggable by user, but labeled, and writes to the global 'objects'
