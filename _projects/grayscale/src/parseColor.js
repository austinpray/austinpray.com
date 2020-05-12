function parseColor(color) {
  const match = color.match(/#((?:[0-9A-F]{1,2}){3})/i);
  if (!match) {
    throw new Error('invalid color format');
  }
  const [r, g, b] = match[1]
    .repeat(2)
    .slice(-6)
    .match(/.{2}/g)
    .map(hex => parseInt(hex, 16));
  return {r, g, b};
}

module.exports = {parseColor}
