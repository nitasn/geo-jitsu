import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'objects',

  /** @type {Object.<string, {type: string, params: object, color: string}>} */
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
    A: {
      type: 'Point',
      params: {
        coords: [3, 1]
      },
      color: 'orange'
    },
    B: {
      type: 'Point',
      params: {
        coords: [1, -1]
      },
      color: '#663399'
    },
  },

  reducers: {
    setParams: (state, { payload: [label, params] }) => {
      state[label].params = params;
    },
    setColor: (state, { payload: [label, color] }) => {
      state[label].color = color;
    },
    delObj: (state, { payload: label }) => {
      delete state[label];
    },
    setObj: (state, { payload: [label, [type, params, color]] }) => {
      state[label] = { type, params, color };
    },
  },
});

export const { setParams, setColor, delObj, setObj } = slice.actions;
export default slice.reducer;
