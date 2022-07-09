export const newId = (() => {
  let current = 1;
  return () => current++;
})();

export function revertablyAssign(to, from) {
  const save = Object.create(null);

  Object.keys(from).forEach((k) => {
    if (k in to) save[k] = to[k];
    to[k] = from[k];
  });

  return function revert() {
    Object.keys(from).forEach((k) => {
      if (k in save) to[k] = save[k];
      else delete to[k];
    });
  };
}
