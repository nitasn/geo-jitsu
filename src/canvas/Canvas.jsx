import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vecSub } from '../math-utils';
import { setDimensions, translate, zoomIn, zoomOut } from '../redux/grid';
import store from '../redux/store';
import { drawGridLines } from './grid-lines';
import Point from './drawables/Point';

import * as drawableFns from './drawables/ctx-drawables';

function useWatchCanvasDimensions(canvasRef) {
  const dispatch = useDispatch();

  const cb = () => {
    if (!canvasRef.current) throw new Error('canvasRef is empty!');
    const { clientWidth, clientHeight } = canvasRef.current;
    canvasRef.current.width = clientWidth; // match screen resolutions
    canvasRef.current.height = clientHeight; // to canvas resolution
    dispatch(setDimensions([clientWidth, clientHeight]));
  };

  React.useEffect(() => {
    cb();
    window.addEventListener('resize', cb);
    return () => window.removeEventListener('resize', cb);
  }, []);
}

function useNoRightClickMenu(canvasRef) {
  React.useEffect(() => {
    canvasRef.current.oncontextmenu = () => false;
  }, []);
}

function useCtx(canvasRef) {
  return React.useMemo(() => canvasRef.current?.getContext('2d'), [canvasRef.current]);
}

function useZoomOnMouseWheel(canvasRef) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const cb = (e) => {
      Math.sign(e.deltaY) > 0 ? dispatch(zoomOut()) : dispatch(zoomIn());
      e.preventDefault(); // don't scroll the page
    };
    canvasRef.current.addEventListener('wheel', cb);
    return () => canvasRef.current.removeEventListener('wheel', cb);
  }, []);
}

function useDragToScroll(canvasRef) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    let prevMouse = null;

    const mousedown = (e) => {
      prevMouse = [e.offsetX, -e.offsetY];
      canvasRef.current.addEventListener('mousemove', mousemove);
      canvasRef.current.addEventListener('mouseup', mouseup, { once: true });
    };

    const mousemove = (e) => {
      const mouse = [e.offsetX, -e.offsetY];
      dispatch(translate(vecSub(mouse, prevMouse)));
      prevMouse = mouse;
    };

    const mouseup = () => {
      canvasRef.current.removeEventListener('mousemove', mousemove);
      prevMouse = null;
    };

    canvasRef.current.addEventListener('mousedown', mousedown);

    return () => {
      canvasRef.current.removeEventListener('mousedown', mousedown);
      if (prevMouse) {
        canvasRef.current.removeEventListener('mousemove', mousemove);
        canvasRef.current.removeEventListener('mouseup', mouseup);
      }
    };
  }, []);
}

function clearCanvas(ctx) {
  const { grid } = store.getState();
  ctx.clearRect(0, 0, grid.width, grid.height);
}

function drawDrawables(ctx) {
  const { points, drawables } = store.getState();
  // we have to ask for the points here, instaed of passing them from useAllDrawings's useEffect...
  // explanation:
  // on the Canvas' first render, useAllDrawings is invoked; it then stores the `points` in its closure,
  // and schedules its effect for after whole Canvas (especially its react-rendered children - e.g. points) are rendered.
  // the problem is - when the effect callback is invoked firstly invoked, the `points` are retrieved from the closure,
  // but it's still empty, because it was created before the react-rendered children (e.g. points) were mounted.

  Object.values(drawables).forEach(({ type, params, color }) => {
    const originalStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = color;
    drawableFns[type](params, ctx, points);
    ctx.strokeStyle = originalStrokeStyle;
  });
}

function useAllDrawings(ctx, points) {
  const grid = useSelector((state) => state.grid);

  React.useEffect(() => {
    if (!ctx) return; // for the first render, before canvasRef.current gets a value

    function drawAll() {
      clearCanvas(ctx);
      drawGridLines(ctx);
      drawDrawables(ctx);
    }

    drawAll();
    window.addEventListener('resize', drawAll); // todo the event listener doesn't have to be rewired when the grid moves...
    return () => window.removeEventListener('resize', drawAll);
  }, [grid, ctx, points]);
}

export default ({ children }) => {
  const canvasRef = React.useRef();

  useNoRightClickMenu(canvasRef);
  useWatchCanvasDimensions(canvasRef);
  useZoomOnMouseWheel(canvasRef);
  useDragToScroll(canvasRef);

  const ctx = useCtx(canvasRef);
  const points = useSelector((state) => state.points);
  useAllDrawings(ctx, points);

  const pointsElements = React.useMemo(() => {
    return Object.entries(points).map(([label, location]) => (
      <Point {...{ label, location }} key={label} />
    ));
  }, [points]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }} className="canvas-wrapper">
      <canvas ref={canvasRef} id="canvas" />
      {/* the 'ctx &&' is exaplained below (1) */}
      {ctx && pointsElements}
    </div>
  );
};


/**
 * (1) why 'ctx &&'
 * points needs the width/height properties from 'grid' slice to calculate their own position.
 * however, this slice will only contain valid informaion after canvas' effects run for the first time.
 * at the 1st render, the 'ctx' variable is undefined, because the ref hasn't linked yet; hence the hack.
 */