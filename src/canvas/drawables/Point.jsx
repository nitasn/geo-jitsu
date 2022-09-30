import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { delPoint, setPoint } from '../../redux/points';
import { fromCanvasCoords, toCanvasCoords } from '../conversions';

export default function Point({ location, label }) {
  useSelector((state) => state.grid); // triger rerender when the grid state changes

  const whereInTheWorld = React.useRef(location);

  // useMoveSelfAccordingToPointsState(whereInTheWorld, label);

  const [left, top] = toCanvasCoords(whereInTheWorld.current);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setPoint({ label, coords: whereInTheWorld.current }));
    return () => dispatch(delPoint({ label }));
  }, []);

  const ref = React.useRef();

  useDragAroundOnCanvas(ref, {
    onMouseMove: (pos) => dispatch(setPoint({ label, coords: fromCanvasCoords(pos) })),
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

/**
 * this is mainly useful to make redux's time-machine trick work.
 * other than that, the only entity that sets a point's location,
 * is the point itself (when dragged around by the user).
 *
 * surely it'll be useful when we add points that are dependent on other points (e.g. MidPoint)
 */
function useMoveSelfAccordingToPointsState(whereInTheWorld, label) {
  const points = useSelector((state) => state.points);
  const [x, y] = points[label] ?? [];
  if (x != undefined && y != undefined) {
    whereInTheWorld.current = [x, y];
  }
  // todo subscribe to state changes without causing a rerender
}
