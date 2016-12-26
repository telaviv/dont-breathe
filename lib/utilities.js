export const clamp = (value, min, max) => {
  if (value > max) {
    return max;
  } else if (value < min) {
    return  min;
  }
  return value;
};
