export const pararels = (...promises) => {
  return Promise.all(promises.map(p => p()));
};
