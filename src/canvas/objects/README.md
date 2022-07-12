## Canvas Objects are Divided into 2 Kinds:

1. React-Element type
   ---
   Siblings of the \<canvas> itself,
   absolute-positioned to appear on the canvas;
   they use hooks to rerender when the grid state changes, 
   and they dispatch to it when the user moves them.

2. Ctx-Drawable type
   ---
   Functions the Canvas calls them whenever the grid state changes;
   they receive the ctx as a param,
   and they draw themselves using ctx methods.