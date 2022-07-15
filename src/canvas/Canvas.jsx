import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vecSub } from '../math-utils';
import { setDimensions, translate, zoomIn, zoomOut } from '../redux/grid';
import store from '../redux/store';
import { revertablyAssign } from '../utils';
import { drawGridLines } from './grid-lines';

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

function drawChildren(ctx, children) {
  const { objects } = store.getState();
  // we have to ask for the children here, instaed of passing them from useAllDrawings's useEffect...
  // explanation:
  // on the Canvas' first render, useAllDrawings is invoked; it then stores the `objects` in its closure,
  // and schedules its effect for after whole Canvas (especially its react-rendered children - e.g. points) are rendered.
  // the problem is - when the effect callback is invoked firstly invoked, the `objects` are retrieved from the closure,
  // but it's still empty, because it was created before the react-rendered children (e.g. points) were mounted.

  React.Children.forEach(children, ({ type: drawingFn, props }) => {
    if (drawingFn.isReactElement) return;
    const revertStyles = props.style && revertablyAssign(ctx, props.style);
    drawingFn(props, ctx, objects);
    revertStyles?.();
  });
}

function useAllDrawings(ctx, children) {
  const grid = useSelector((state) => state.grid);
  const objects = useSelector((state) => state.objects);

  const childrenToDraw = React.useMemo(
    // See objects/README.md
    () => children.filter(({ type }) => !type.isReactElement),
    [children]
  );

  React.useEffect(() => {
    if (!ctx) return;
    // for the first render, before canvasRef.current gets a value

    function drawAll() {
      clearCanvas(ctx);
      drawGridLines(ctx);
      drawChildren(ctx, childrenToDraw);
    }

    drawAll();
    window.addEventListener('resize', drawAll);
    return () => window.removeEventListener('resize', drawAll);
  }, [grid, ctx, objects]);
}

export default ({ children }) => {
  const canvasRef = React.useRef();

  useNoRightClickMenu(canvasRef);
  useWatchCanvasDimensions(canvasRef);
  useZoomOnMouseWheel(canvasRef);
  useDragToScroll(canvasRef);

  const ctx = useCtx(canvasRef);
  useAllDrawings(ctx, children);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }} className="canvas-wrapper">
      <canvas ref={canvasRef} id="canvas" />
      {/* See drawables/README.md */}
      {ctx && children.filter((child) => child.type.isReactElement)}
    </div>
  );
};