import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vecSub } from '../math-utils';
import { setDimensions, translate, zoomIn, zoomOut } from '../redux/grid';
import store from '../redux/store';
import { revertablyAssign } from '../utils';
import { drawGridLines } from './grid-lines';

import ReactDOM from 'react-dom';

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
  React.Children.forEach(children, ({ type: drawingFn, props }) => {
    if (drawingFn.rendersItself) return;
    const revertStyles = props.style && revertablyAssign(ctx, props.style);
    drawingFn(props, ctx);
    revertStyles?.();
  });
}

function useAllDrawings(ctx, children) {
  const grid = useSelector((state) => state.grid);

  React.useEffect(() => {
    if (!ctx) return; // for the very first render, before canvasRef.current gets a value

    function drawAll() {
      clearCanvas(ctx);
      drawGridLines(ctx);
      drawChildren(ctx, children);
    }

    drawAll();
    window.addEventListener('resize', drawAll);
    return () => window.removeEventListener('resize', drawAll);
  }, [grid, ctx]);
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
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} id="canvas" />
      {/* 
        I wish those could be children of the canvas, but when they are, they're not shown. 
        Canvas' child elements are meant as a fall back for when the 
        browser doesn't support the <canvas> tag 
      */}
      {ctx && children.filter((child) => child.type.rendersItself)}
    </div>
  );
};
