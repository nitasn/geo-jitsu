/**
 * put a space before each capital letter (except for the first)
 * 
 * ` "LineSegmentThing" -> "Line Segment Thing" `
 */
// const withSpaces = (name) => name.replace(/(?<!^)([A-Z])/g, ' $1');
// safari doesn't support this negative lookbehind `(?<!^)`, hence:
const withSpaces = (name) => name.replace(/([A-Z])/g, ' $1').trim();

import * as drawablesFns from '../canvas/drawables/ctx-drawables';
const drawablesNames = Object.keys(drawablesFns).map(withSpaces);

export default ['Point', ...drawablesNames];