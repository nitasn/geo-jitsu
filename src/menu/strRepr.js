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

const shouldBeCoords = new Set([
  "location", "from", "to", "center",
  "left", "middle", "right"
]);

const shouldBeNumbers = new Set(["radius"]);

/**
 * upon success, returns a new object (where values like "3, 4." are converted into [3, 4]);
 * upon failure, returns null
 * @returns {object?}
 */
export function _validateAndMapParamsFromStrings(type, params) {
  const { objects } = store.getState();

  // todo the type should play a role...
  const results = { ...params };

  for (const [key, value] of Object.entries(params)) {
    if (value in objects) continue; // if the value is the label of an existing object
    // todo also prevent recursion: object cannot depend on itself

    if (shouldBeCoords.has(key)) {
      const asNumArr = value.split(',').map((str) => +str.trim());
      if (asNumArr.length != 2 || isNaN(asNumArr[0]) || isNaN(asNumArr[1])) return null;
      results[key] = asNumArr;
    }
    else if (shouldBeNumbers.has(key)) {
      results[key] = Number(value);
    }
    else {
      console.log(`rejecting because: key '${key}' is neither coords nor number`);
      return null;
    }
  }

  return results;
}