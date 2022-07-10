import React from 'react';
import { useSelector } from 'react-redux';
import { fromCanvasCoords, toCanvasCoords } from './conversions';

export default function Point({ location, label }) {
  useSelector((state) => state.grid);

  const whereInTheWorld = React.useRef(location);
  const [left, top] = toCanvasCoords(whereInTheWorld.current);

  const ref = React.useRef();
  useDragAroundWithMouse(ref, function onDragEnd(canvCoords) {
    whereInTheWorld.current = fromCanvasCoords(canvCoords);
  });

  const diameter = 8;
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
      }}
    >
      <p style={{ position: 'absolute', left: 10, fontSize: 14, color: '#777' }}>
        {label}
      </p>
    </div>
  );
}

Point.rendersItself = true;

function useDragAroundWithMouse(ref, onDragEnd) {
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
    };

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove);
      moving = false;
      onDragEnd?.(whereInCanvCoords(e));
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
