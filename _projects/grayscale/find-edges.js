const {getEdges} = require("./src/find-edges.js");

const {
  isGrayHCL,
  isGrayHCLOpt,
  isGrayHSV,
  isGrayRange,
  isGraySD,
  isGrayVar
} = require("./src/lib.js");

const hues = {
  red: 0,
  yellow: 60,
  green: 120,
  cyan: 180,
  blue: 240,
  magenta: 300,
  bootstrap: 210,
};

function formatColors(colors, {fmt = 'raw'} = {}) {
  switch (fmt) {
    case 'csv':
      return colors.map(color => `${color.v}, ${color.s}`);
    case 'hex':
      return colors.map(color => color.formatHex())
  }
  return colors;
}


let targetHue = process.argv[2];
if (!targetHue) {
  throw Error('not a valid hue');
}

let curve = isGraySD;

const curves = {
  sd: isGraySD,
  variance: isGrayVar,
  hcl: isGrayHCL,
  hclopt: isGrayHCLOpt,
  range: isGrayRange,
}

if (process.argv[4] in curves) {
  curve = curves[process.argv[4]]
}

let converted = Number.parseInt(targetHue, 10);
let hue = Number.isNaN(converted) ? hues[targetHue] : converted;

const colors = getEdges(hue, {curve}).sort((a, b) => b.v - a.v);

formatColors(colors, {fmt: process.argv[3]})
  .forEach(c => console.log(c));

