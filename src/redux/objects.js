import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'objects',

  /** @type {Object.<string, {type: string, params: object, color: string}>} */
  initialState: {
    LS1: {
      type: 'LineSegment',
      params: {
        from: 'A',
        to: 'B',
      },
      color: 'yellow',
    },
    LS2: {
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
    P1: {
      "type": "Point",
      "params": {
        "coords": [0.9041666666666667, 0.32083333333333336]
      },
      "color": "lightblue"
    },
    P2: {
      "type": "Point",
      "params": {
        "coords": [0.9125, 1.0041666666666667]
      },
      "color": "lightblue"
    },
    P3: {
      "type": "Point",
      "params": {
        "coords": [1.4958333333333333, 0.8708333333333333]
      },
      "color": "lightblue"
    },
    P4: {
      "type": "Point",
      "params": {
        "coords": [2.0625, 0.3352273305257162]
      },
      "color": "lightblue"
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
