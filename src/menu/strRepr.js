import store from '../redux/store';
import { roundToDecPlaces } from '../math-utils';

export function prettyPoint(arrOrLabel) {
  if (Array.isArray(arrOrLabel)) return `(${_arrToCsv(arrOrLabel)})`;
  return arrOrLabel; // it's a label
}

function _arrToCsv(values) {
  return values.map((x) => roundToDecPlaces(x, 3)).join(', ');
}

export function _mapValuesToStrings(kvPairs) {
  const res = { ...kvPairs };
  for (const [k, v] of Object.entries(res)) {
    if (Array.isArray(v)) {
      res[k] = _arrToCsv(v);
    }
  }
  return res;
}

/**
 * upon success, returns a new object (where values like "3, 4." are converted into [3, 4]);
 * upon failure, returns null
 * @returns {object?}
 */
export function _validateAndMapParamsFromStrings(type, params) {
  const { points } = store.getState();

  // todo the type should play a role...
  const results = { ...params };

  for (const [key, value] of Object.entries(params)) {
    if (value in points && key != value) continue; // if the value is the label of an existing (different) point

    const asNumArr = value.split(',').map((str) => +str.trim());
    if (asNumArr.length != 2 || isNaN(asNumArr[0]) || isNaN(asNumArr[1])) return null;

    results[key] = asNumArr;
  }

  return results;
}

/**
 * todo
 *
 * 1. on any item params change,
 *    it doesn't trigger canvas re-render rn...
 *    until i drag the grid around...
 *
 * 2. if a drawable uses invalid values (labels of non-existing points)
 *    the drawable won't be drawn, and its box in the menu will be clearly mark;
 *    the wrong label will be red, and on hover a tool tip will explain the problem.
 *
 */
