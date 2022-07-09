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
  const [ctx, setCtx] = React.useState();

  React.useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'));
  }, []);

  return ctx;
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

const LEFT_MOUSE_BUTTON = 0;

function useDragToScroll(canvasRef) {
  const dispatch = useDispatch();
  let prevMouse = null;

  const mousedown = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    prevMouse = [e.offsetX, -e.offsetY];
    canvasRef.current.addEventListener('mousemove', mousemove);
    canvasRef.current.addEventListener('mouseup', mouseup);
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

  React.useEffect(() => {
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

function useAllDrawings(ctx) {
  const grid = useSelector((state) => state.grid);

  React.useEffect(() => {
    if (!ctx) return;

    function drawAll() {
      clearCanvas(ctx);
      drawGridLines(ctx);
      invokeDrawingFunctions(ctx);
    }

    drawAll();
    window.addEventListener('resize', drawAll);
    return () => window.removeEventListener('resize', drawAll);
  }, [ctx, grid]);
}

const drawingFunctions = new Map();

function invokeDrawingFunctions(ctx) {
  drawingFunctions.forEach((styles, fn) => {
    const revertStyles = styles && revertablyAssign(ctx, styles);
    fn(ctx);
    revertStyles?.();
  });
}

function useOurCoolApi(refToSelf) {
  React.useImperativeHandle(refToSelf, () => ({
    /**
     * @param {(ctx: CanvasRenderingContext2D) => void} fn
     * @param {Object?} styles to apply on the canvas's context before drawing
     */
    addDrawing: (fn, styles = null) => {
      drawingFunctions.set(fn, styles);
    },
    /**
     * @param {(ctx: CanvasRenderingContext2D) => void} fn
     */
    removeDrawing: (fn) => {
      drawingFunctions.delete(fn);
    },
  }));
}

export default React.forwardRef((props, refToSelf) => {
  const canvasRef = React.useRef();

  useNoRightClickMenu(canvasRef);
  useWatchCanvasDimensions(canvasRef);
  useZoomOnMouseWheel(canvasRef);
  useDragToScroll(canvasRef);

  const ctx = useCtx(canvasRef);
  useAllDrawings(ctx);

  useOurCoolApi(refToSelf);

  return <canvas {...props} ref={canvasRef} />;
});
