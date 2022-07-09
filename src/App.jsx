import React from 'react';
import Canvas from './canvas/Canvas';
import { circle, lineSegment, mathFunction, point } from './canvas/drawing-fns';

export default () => {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current.addDrawing(circle({ center: [1, 0], radius: 1 }), {
      strokeStyle: 'green',
    });

    ref.current.addDrawing(lineSegment({ from: [1, -1], to: [2, -1] }), {
      strokeStyle: 'yellow',
    });

    ref.current.addDrawing(mathFunction(x => x ** 2 - x), {
      strokeStyle: 'red',
    });

    ref.current.addDrawing(point({ location: [1, -1], label: 'A' }), {
      strokeStyle: 'black',
      fillStyle: 'yellow',
    });
    
    ref.current.addDrawing(point({ location: [2, -1], label: 'B' }), {
      strokeStyle: 'black',
      fillStyle: 'yellow',
    });
  }, []);

  return (
    <>
      <Canvas ref={ref} />
      <Debug />
    </>
  );
};

function Debug() {}

function Button({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        paddingBlock: '.75rem',
        paddingInline: '1.5rem',
        cursor: 'pointer',
        borderRadius: '.5rem',
        marginInline: '.5rem',
        marginBottom: '.5rem',
        backgroundColor: '#111',
        color: '#ccc',
        boxShadow: 'inset 2px 4px 8px 0px rgba(255, 255, 255, 0.15)',
        textAlign: 'center',
      }}
    >
      {title}
    </button>
  );
}
