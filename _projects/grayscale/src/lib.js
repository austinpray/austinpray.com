const {color: parseColor, lch} = require('d3-color');
const {hsv} = require('d3-hsv');

function isGrayscale(color) {
  const {r, g, b} = parseColor(color);

  return r === g && r === b;
}

const SD_LIMIT = 7;

function _mean(arr) {
  return arr.reduce((sum, c) => sum + c, 0) / arr.length;
}

function _variance(arr) {
  const mean = _mean(arr);
  const squareSum = arr.reduce((sum, c) => sum + Math.pow((c - mean), 2), 0);
  return squareSum / arr.length;
}

const VAR_LIMIT = 49;

function isGrayVar(color) {
  const {r, g, b} = parseColor(color);
  return _variance([r, g, b]) <= VAR_LIMIT;
}

function isGraySD(color) {
  const {r, g, b} = parseColor(color);
  const sd = Math.sqrt(_variance([r, g, b]));

  return sd <= SD_LIMIT;
}

function isGrayHCL(color) {
  let chroma = hcl(color).c;
  return isNaN(chroma) || chroma <= 6.05
}

function _clamp(x, min, max) {
  if (x < min) {
    x = min
  } else if (x > max) {
    x = max
  }
  return x
}

function _smoothstep(a, b, x) {
  const t = _clamp((x - a) / (b - a), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

const hueToleranceStopsV1 = [
  [0, 3.1], // red
  [20, 3.1], // orange
  [61.8, 8], // orange
  [66, 7.49], // orange
  [75, 6.8], // orange
  [100, 2], // yellow-green
  [180, 2], // green
  [240, 5.4], // blue
  [262, 14], // blue
  [263, 14], // blue
  [290, 6.5],
  [310, 3.1], // red
  [360, 3.1],
];

function _buildCurve(stops) {
  return function (value) {
    let a, b, from, to;
    for (const [x, y] of stops) {
      if (value >= x) {
        a = x;
        from = y;
      }
      if (value <= x) {
        b = x;
        to = y;
        break;
      }
    }
    if (a === b) {
      return to;
    }
    return _smoothstep(a, b, value) * (to - from) + from;
  }
}

const lightnessToleranceStops = [
  [0, 1],
  [25, 1],
  //[48.7, 1],
  [98, 1],
  [100, 0.9],
];


const hueCurveLCh = _buildCurve(hueToleranceStopsV1);
const lightnessCurveLCh = _buildCurve(lightnessToleranceStops);

function isGrayLChOpt(color) {
  const {l: lightness, c: chroma, h: hue} = lch(color);
  // black and white
  if ([0, 100].includes(lightness)) {
    return true;
  }
  // grayscale
  if (chroma === 0) {
    return true;
  }
  //console.log(color, chroma, hue, hueCurveLCh(hue))
  return chroma <= hueCurveLCh(hue)
}

const RANGE_LIMIT = 17;

function isGrayRange(color) {
  const {r, g, b} = parseColor(color);
  const rgb = [r, g, b];
  return Math.max(...rgb) - Math.min(...rgb) <= RANGE_LIMIT;
}

module.exports = {
  isGrayscale,
  isGrayHCLOpt: isGrayLChOpt,
  isGrayHCL,
  isGrayRange,
  isGraySD,
  isGrayVar,
  _buildCurve,
  hueCurveLCh,
  lightnessCurveLCh,
};

