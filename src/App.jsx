import React from 'react';
import { useSelector } from 'react-redux';
import Canvas from './canvas/Canvas';
import Menu from './menu/Menu';

import Point from './canvas/drawables/Point';
import {
  AngleBisector,
  Circle,
  LineSegment,
  MathFunction,
  PerpendicularBisector,
} from './canvas/drawables/ctx-drawables';

// todo and point
// import * as ctxDrawables from './canvas/drawables/ctx-drawables';

export default () => {
  // const drawables = useSelector((state) => state.drawables);

  return (
    <>
      <Canvas>

        <Point location={[-Math.PI / 2, 0]} label="A" />
        <Point location={[0, Math.PI / 2]} label="B" />

        <LineSegment from='A' to='B' color='yellow' />

        <MathFunction func={Math.sin} color="lightblue" />
        <Circle center="A" color="green" radius={1} />
      </Canvas>

      <Menu />
    </>
  );
};

// todo - Point should display a Msg_HasToBeCanvasChild if rendered outside the Canvas

// todo - Point should be given style instead of being always yellow

// todo - add DependencePoint (e.g. MidPoint); not draggable by user, but labeled, and writes to the global 'points'

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

