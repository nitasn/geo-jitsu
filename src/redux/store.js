import { configureStore } from '@reduxjs/toolkit';
import grid from './grid';
import points from './points';
import drawables from './drawables';

export default configureStore({
  reducer: {
    grid,
    points,
    drawables,
  },
});
