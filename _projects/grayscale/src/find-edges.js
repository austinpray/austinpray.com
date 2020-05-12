const {hsv} = require('d3-hsv');

function getEdges(hue, {curve} = {}) {
  const found = {};
  for (let value = 100; value > -0; value--) {
    for (let saturation = 0; saturation <= 100; saturation++) {
      const color = hsv(hue, saturation / 100, value / 100);
      if (color.displayable() && !curve(color)) {
        break;
      }
      found[color.v] = color;
    }
  }
  return Object.values(found);
}

module.exports = {
  getEdges
}
