import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { remove, set } from '../../redux/objects';
import { fromCanvasCoords, toCanvasCoords } from '../conversions';

export default function Point({ location, label }) {
  useSelector((state) => state.grid); // triger rerender when the grid state changes

  const whereInTheWorld = React.useRef(location);
  const [left, top] = toCanvasCoords(whereInTheWorld.current);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(set({ key: label, value: whereInTheWorld.current }));
    return () => dispatch(remove({ key: label }));
  }, []);

  const ref = React.useRef();

  useDragAroundOnCanvas(ref, {
    onMouseMove: (pos) => dispatch(set({ key: label, value: fromCanvasCoords(pos) })),
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
      <p
        style={{
          position: 'absolute',
          left: 10,
          fontSize: 13,
          // textShadow:
          //   'rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.75517px 0.958851px 0px, rgb(0, 0, 0) 1.0806px 1.68294px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.81859px 0px, rgb(0, 0, 0) -1.60229px 1.19694px 0px, rgb(0, 0, 0) -1.97998px 0.28224px 0px, rgb(0, 0, 0) -1.87291px -0.701566px 0px, rgb(0, 0, 0) -1.30729px -1.5136px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.91785px 0px, rgb(0, 0, 0) 1.41734px -1.41108px 0px, rgb(0, 0, 0) 1.92034px -0.558831px 0px',
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
