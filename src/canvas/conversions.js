import store from '../redux/store';

export function toCanvasDistance(distance) {
  const { grid } = store.getState();
  return distance * grid.pixelsPerUnit;
}

export function fromCanvasDistance(distance) {
  const { grid } = store.getState();
  return distance / grid.pixelsPerUnit;
}

export function toCanvasCoords([x, y]) {
  const { grid } = store.getState();
  return [toCanvasCoordX(x, grid), toCanvasCoordY(y, grid)];
}

export function fromCanvasCoords([x, y]) {
  const { grid } = store.getState();
  return [fromCanvasCoordX(x, grid), fromCanvasCoordY(y, grid)];
}

export function toCanvasCoordX(x, grid = store.getState().grid) {
  return (x + grid.translate[0]) * grid.pixelsPerUnit + grid.width / 2;
}

export function toCanvasCoordY(y, grid = store.getState().grid) {
  return grid.height / 2 - (y + grid.translate[1]) * grid.pixelsPerUnit;
}

export function fromCanvasCoordX(x, grid = store.getState().grid) {
  return (x - grid.width / 2) / grid.pixelsPerUnit - grid.translate[0];
}

export function fromCanvasCoordY(y, grid = store.getState().grid) {
  return (grid.height / 2 - y) / grid.pixelsPerUnit - grid.translate[1];
}
