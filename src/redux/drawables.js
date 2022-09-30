import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'drawables',
  initialState: {
    ln1: {
      type: 'LineSegment',
      params: {
        from: [1, 2],
        to: [1.5, -1],
      },
      color: 'green',
    },
    ln2: {
      type: 'LineSegment',
      params: {
        from: [-1, -2],
        to: [-1.5, 1],
      },
      color: 'yellow',
    },
  },

  reducers: {
    setParams: (state, { payload: [label, params] }) => {
      state[label].params = params;
    },
    setColor: (state, { payload: [label, color] }) => {
      state[label].color = color;
    },
    removeDrawable: (state, { payload: { label } }) => {
      delete state[label];
    },
  },
});

export const { setParams, setColor, removeDrawable } = slice.actions;
export default slice.reducer;
