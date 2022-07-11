import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'objects',
  initialState: {},

  reducers: {
    set: (state, { payload: { key, value } }) => {
      state[key] = value;
    },
    remove: (state, { payload: { key } }) => {
      delete state[key];
    },
  },
});

export const { set, remove } = slice.actions;
export default slice.reducer;
