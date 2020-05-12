const {hueCurveLCh} = require('./src/lib');
const {normalizeStr} = require('./src/utils');
const {lch} = require('d3-color');

function getSvg() {
  const colorStops = [];
  const chart = [];
  for (let hue = 0; hue <= 360; hue++) {
    colorStops.push(lch(70, 40, hue).toString());
    chart.push(hueCurveLCh(hue));
  }
  const width = 360;
  const height = 50;

  const linePoints = chart
    .map((limit, hue) => {
      const cx = hue;
      const cy = 50 - limit * 3;
      return [cx, cy].join(',')
    })
    .join(' ');
  const line = `<polyline points="${linePoints}"
            fill="none" stroke-width="1" stroke="blue" />`;
  const svg = `
  <svg viewBox="0 0 ${width} ${height}" width="${width*2}" height="${height*2}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="myGradient">
        ${colorStops.map((color, hue) => `<stop offset="${hue/360*100}%"  stop-color="${color}" />`).join("\n")}
      </linearGradient>
    </defs>
 
    <rect x="0" y="0" width="360" height="50" fill="url('#myGradient')" />
    ${line}
    
  </svg>
  `;
  return normalizeStr(svg);
}

console.log(getSvg());
