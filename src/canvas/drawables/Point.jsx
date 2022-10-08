import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setObj, delObj, setParams } from '../../redux/objects';
import { fromCanvasCoords, toCanvasCoords } from '../conversions';

export default function Point({ location, label, color = 'yellow' } = {}) {
  useSelector((state) => state.grid); // triger rerender when the grid state changes

  const whereInTheWorld = React.useRef(location);

  useMoveSelfAccordingToPointsSlice(whereInTheWorld, label);

  const [left, top] = toCanvasCoords(whereInTheWorld.current);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setObj([label, ['Point', { coords: whereInTheWorld.current }, color]]));
    return () => dispatch(delObj(label));
  }, []);

  const ref = React.useRef();

  useDragAroundOnCanvas(ref, {
    onMouseMove: (pos) => dispatch(setParams([label, { coords: fromCanvasCoords(pos) }])),
    onMouseUp: (pos) => (whereInTheWorld.current = fromCanvasCoords(pos)),
  });

  const diameter = 8;

  const shadowColor = 'black';
  const textColor = '#ccc';
  const textShadow = `${shadowColor} 1px 0px 0px, ${shadowColor} 0.540302px 0.841471px 0px, ${shadowColor} -0.416147px 0.909297px 0px, ${shadowColor} -0.989992px 0.14112px 0px, ${shadowColor} -0.653644px -0.756802px 0px, ${shadowColor} 0.283662px -0.958924px 0px, ${shadowColor} 0.96017px -0.279415px 0px`;

  return (
    <div
      ref={ref}
      style={{
        width: diameter,
        height: diameter,
        backgroundColor: color,
        border: '1px solid #333',
        borderRadius: '100vmax',
        position: 'absolute',
        left,
        top,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <p
        style={{
          position: 'absolute',
          left: 10,
          fontSize: 13,
          textShadow,
          color: textColor,
        }}
      >
        {label}
      </p>
    </div>
  );
}

Point.isReactElement = true;

function useDragAroundOnCanvas(ref, { onMouseMove, onMouseUp }) {
  React.useEffect(() => {
    let isMoving = false;

    // we have to cache this, because the effect returned function gets called
    // after the ref is cleared...
    const pointEl = ref.current;

    const mousedown = (e) => {
      isMoving = true;
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup, { once: true });
    };

    const whereInCanvCoords = (e) => {
      const { x, y } = document.getElementById('canvas').getBoundingClientRect();
      return [e.x - x, e.y - y];
    };

    const mousemove = (e) => {
      const [x, y] = whereInCanvCoords(e);
      pointEl.style.left = `${x}px`;
      pointEl.style.top = `${y}px`;
      onMouseMove?.(whereInCanvCoords(e));
    };

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove);
      isMoving = false;
      onMouseUp?.(whereInCanvCoords(e));
    };

    pointEl.addEventListener('mousedown', mousedown);

    return () => {
      pointEl.removeEventListener('mousedown', mousedown);
      // won't hurt to call remove on them even if they don't exist:
      pointEl.removeEventListener('mousemove', mousemove);
      pointEl.removeEventListener('mouseup', mouseup);
    };
  }, []);
}

function useMoveSelfAccordingToPointsSlice(whereInTheWorld, label) {
  const me = useSelector((state) => state.objects[label]);
  const [x, y] = me?.coords ?? [];
  if (x != undefined && y != undefined) {
    whereInTheWorld.current = [x, y];
  }
}
