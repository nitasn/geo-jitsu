import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'drawables',
  initialState: {
    ln1: {
      type: 'LineSegment',
      params: {
        from: 'A',
        to: 'B',
      },
      color: 'yellow',
    },
    ln2: {
      type: 'LineSegment',
      params: {
        from: [-1, -2],
        to: [-1.5, 1],
      },
      color: 'white',
    },
  },

  reducers: {
    setParams: (state, { payload: [label, params] }) => {
      state[label].params = params;
    },
    setColor: (state, { payload: [label, color] }) => {
      state[label].color = color;
    },
    removeDrawable: (state, { payload: label }) => {
      delete state[label];
    },
    setDrawable: (state, { payload: [label, { type, params, color }] }) => {
      state[label] = { type, params, color };
    },
  },
});

export const { setParams, setColor, removeDrawable, setDrawable } = slice.actions;
export default slice.reducer;
