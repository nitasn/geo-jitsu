# How Canvas Children Work

## Canvas Children are Divided into 2 Kinds:

1. React-Elements
   ---
   They're siblings of the \<canvas> itself,
   absolute-positioned to appear in the right place.

   They use hooks to rerender when the grid state changes, 
   and they dispatch to the grid state when the user moves them.

   A \<Point> is a React-Element.

2. Ctx-Drawables
   ---
   They're just functions the Canvas calls, with its ctx as a parameter, whenever the grid state changes.

   They then **draw themselves using ctx methods**.
   
   Most of the possible children (e.g. LineSegment, MathFunction) are ctx-drawable.