import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'points',
  initialState: {},

  reducers: {
    setPoint: (state, { payload: { label, coords } }) => {
      state[label] = coords;
    },
    delPoint: (state, { payload: { label } }) => {
      delete state[label];
    },
  },
});

export const { setPoint, delPoint } = slice.actions;
export default slice.reducer;
