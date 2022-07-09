import { configureStore } from '@reduxjs/toolkit';
import grid from './grid';

export default configureStore({
  reducer: {
    grid,
  },
});
