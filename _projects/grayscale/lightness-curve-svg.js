const {lightnessCurveLCh} = require('./src/lib');
const {normalizeStr} = require('./src/utils');
const {lch} = require('d3-color');

function getSvg() {
  const chart = [];
  for (let lightness = 0; lightness <= 100; lightness++) {
    chart.push(lightnessCurveLCh(lightness));
  }
  const width = 100;
  const height = width*0.14;

  const linePoints = chart
    .map((limit, lightness) => {
      const cx = lightness;
      const cy = height - limit * 5;
      return [cx, cy].join(',')
    })
    .join(' ');
  const line = `<polyline points="${linePoints}"
            fill="none" stroke-width="0.5%" stroke="blue" />`;
  const svg = `
  <svg viewBox="0 0 ${width} ${height}" width="${width*7.2}" height="${height*7.2}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="myGradient">
        <stop offset="0%" stop-color="black" />
        <stop offset="100%" stop-color="white" />
      </linearGradient>
    </defs>
 
    <rect x="0" y="0" width="${width}" height="${height}" fill="url('#myGradient')" />
    ${line}
    
  </svg>
  `;
  return normalizeStr(svg);
}

console.log(getSvg());
