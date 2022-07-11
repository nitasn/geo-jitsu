import { configureStore } from '@reduxjs/toolkit';
import grid from './grid';
import objects from './objects';

export default configureStore({
  reducer: {
    grid,
    objects,
  },
});
