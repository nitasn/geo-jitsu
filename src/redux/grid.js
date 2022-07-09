import { createSlice } from '@reduxjs/toolkit';
import { vecAdd, vecDot } from '../math-utils';

const slice = createSlice({
  name: 'grid',
  initialState: {
    /** distance in pixels from the canvas' [0, 0] to the canvas' [1, 0] */
    pixelsPerUnit: 120,
    /** translation occurs in world coordinates */
    translate: [0, 0],
    /** current width of the canvas in pixels */
    width: NaN,
    /** current height of the canvas in pixels */
    height: NaN,
  },

  reducers: {
    zoomIn: (state, { payload }) => {
      state.pixelsPerUnit *= payload ?? 1.025;
    },
    zoomOut: (state, { payload }) => {
      state.pixelsPerUnit /= payload ?? 1.025;
    },
    translate: (state, { payload }) => {
      state.translate = vecAdd(vecDot(payload, 1 / state.pixelsPerUnit), state.translate);
    },
    setDimensions: (state, { payload }) => {
      [state.width, state.height] = payload;
    },
  },
});

export const { zoomIn, zoomOut, translate, setDimensions } = slice.actions;
export default slice.reducer;
