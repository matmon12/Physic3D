export const getImageUrl = (path) => {
  return new URL(`../img/${path}`, import.meta.url).href;
};

export const randomTwoRange = (range1, range2) => {
  const random = Math.random();

  const [min1, max1] = range1;
  const [min2, max2] = range2;

  if (random < 0.5) {
    return Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
  } else {
    return Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
  }
};
