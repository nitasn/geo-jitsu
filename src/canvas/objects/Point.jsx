import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set } from '../../redux/objects';
import { fromCanvasCoords, toCanvasCoords } from '../conversions';

export default function Point({ location, label }) {
  useSelector((state) => state.grid);

  const whereInTheWorld = React.useRef(location);
  const [left, top] = toCanvasCoords(whereInTheWorld.current);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(set({ key: label, value: whereInTheWorld.current }));
  }, []);

  const ref = React.useRef();

  useDragAroundOnCanvas(ref, {
    onMouseMove: (pos) => dispatch(set({ key: label, value: fromCanvasCoords(pos) })),
    onMouseUp: (pos) => (whereInTheWorld.current = fromCanvasCoords(pos)),
  });

  const diameter = 7;
  return (
    <div
      ref={ref}
      style={{
        width: diameter,
        height: diameter,
        backgroundColor: 'yellow',
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
      <p style={{ position: 'absolute', left: 10, fontSize: 14, color: '#777' }}>
        {label}
      </p>
    </div>
  );
}

Point.rendersItself = true;

function useDragAroundOnCanvas(ref, { onMouseMove, onMouseUp }) {
  React.useEffect(() => {
    let moving = false;

    const mousedown = (e) => {
      moving = true;
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup, { once: true });
    };

    const whereInCanvCoords = (e) => {
      const { x, y } = document.getElementById('canvas').getBoundingClientRect();
      return [e.x - x, e.y - y];
    };

    const mousemove = (e) => {
      const [x, y] = whereInCanvCoords(e);
      ref.current.style.left = `${x}px`;
      ref.current.style.top = `${y}px`;
      onMouseMove?.(whereInCanvCoords(e));
    };

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove);
      moving = false;
      onMouseUp?.(whereInCanvCoords(e));
    };

    ref.current.addEventListener('mousedown', mousedown);

    return () => {
      ref.current.removeEventListener('mousedown', mousedown);
      if (moving) {
        ref.current.removeEventListener('mousemove', mousemove);
        ref.current.removeEventListener('mouseup', mouseup);
      }
    };
  }, []);
}
