import * as drawablesFns from '../canvas/drawables/ctx-drawables';

/**
 * put a space before each capital letter (except for the first)
 * 
 * ` "LineSegmentThing" -> "Line Segment Thing" `
 */
const withSpaces = (name) => name.replace(/(?<!^)([A-Z])/g, ' $1');

const drawablesNames = Object.keys(drawablesFns).map(withSpaces);

export default ['Point', ...drawablesNames];