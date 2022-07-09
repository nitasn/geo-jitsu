export function vecAdd([x1, y1], [x2, y2]) {
  return [x1 + x2, y1 + y2];
}

export function vecSub([x1, y1], [x2, y2]) {
  return [x1 - x2, y1 - y2];
}

export function vecDot([x, y], other) {
  if (typeof other === 'number') return [x * other, y * other];
  return x * other.x + y * other.y;
}

/** round upwards to a multiple of a given number.
 *  ceilToNextMultiple(42.5, 15) === 45
 *  ceilToNextMultiple(10, 5) === 10
 */
export function ceilToNextMultiple(num, multiplesOf = 1) {
  return Math.ceil(num / multiplesOf) * multiplesOf;
}

/**
 * round to the closest multiple of (some power of) ten.
 */
export function RoundToDecPlaces(num, decimal_places = 0) {
  const integer = Math.round((num + Number.EPSILON) * 10 ** decimal_places);

  return integer / 10 ** decimal_places;
}

export function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max))
}
