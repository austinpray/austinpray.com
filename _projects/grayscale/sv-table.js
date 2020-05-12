const {hsv} = require("d3-hsv");

// default
let hexValues = `
#ffffff
#f8f9fa
#e9ecef
#dee2e6
#ced4da
#adb5bd
#6c757d
#495057
#343a40
#212529
#000000
`;

const useLine = true;
const format = process.argv[2];

async function getStdin() {
  let input = '';
  return new Promise(resolve => {
    process.stdin.on('readable', () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        input += chunk;
      }
    });

    process.stdin.on('end', () => {
      resolve(input);
    });
  });
}

async function main() {

  if (!Boolean(process.stdin.isTTY)) {
    process.stdin.setEncoding('utf8');
    hexValues = await getStdin();
  }

  hexValues = hexValues.trim().split('\n');

  const table = {}
  let hue;
  for (const value of hexValues) {
    table[value] = hsv(value)
    if (!hue && table[value].h) {
      hue = table[value].h
    }
  }

  const tableRows = Object.keys(table)
    .map(k => `<tr>
    <td><code data-color>${k}</code></td>
    <td>${Math.round((isNaN(table[k].s) ? 1 : table[k].s) * 100)}</td>
    <td>${Math.round(table[k].v * 100)}</td>
  </tr>`)
    .join('\n');

  const htmlTable = `
  <table class="table">
    <thead>
      <tr><th>hex</th><th>saturation</th><th>value</th></tr>
    </thead>
  <tbody>
  ${tableRows}
  </tbody>
  </table>
  `;

  const scatterPoints = Object.keys(table)
    .map(k => {
      const cx = table[k].s
      const cy = 1 - table[k].v
      return `<circle cx="${isNaN(cx) ? 1 : cx}" cy="${cy}" r="1%" stroke-width="1%" stroke="blue" fill="transparent" />`
    })
    .join('\n');

  const linePoints = Object.keys(table)
    .map(k => {
      const cx = table[k].s
      const cy = 1 - table[k].v
      return [cx, cy].join(',')
    })
    .join(' ');
  const line = `<polyline points="${linePoints}"
            fill="none" stroke-width="1%" stroke="blue" />`;

  const bsDots = `
    <circle cx="0.007999999999999972" cy="0.019607843137254943" r="1%" stroke-width="1%" stroke="red" fill="transparent" />
    <circle cx="0.025104602510460282" cy="0.06274509803921569" r="1%" stroke-width="1%" stroke="red" fill="transparent" />
    <circle cx="0.034782608695652174" cy="0.0980392156862745" r="1%" stroke-width="1%" stroke="red" fill="transparent" />
    <circle cx="0.05504587155963296" cy="0.14509803921568631" r="1%" stroke-width="1%" stroke="red" fill="transparent" />
    <circle cx="0.08" cy="0.2588235294117647" r="1%" stroke-width="1%" stroke="red" fill="transparent"/>
    <circle cx="0.13" cy="0.5098039215686274" r="1%" stroke-width="1%" stroke="red" fill="transparent"/>
    <circle cx="0.16091954022988514" cy="0.6588235294117647" r="1%" stroke-width="1%" stroke="red" fill="transparent" />
    <circle cx="0.1875" cy="0.7490196078431373" r="1%" stroke-width="1%" stroke="red" fill="transparent" />
    <circle cx="0.19512195121951217" cy="0.8392156862745098" r="1%" stroke-width="1%" stroke="red" fill="transparent" />
  `;


  const svg = `
  <svg viewBox="0 0 1 1" width="1000" height="1000" class="figure" xmlns="http://www.w3.org/2000/svg">
  <defs>
  <linearGradient id="value" x2="0%" y2="0%" x1="0%" y1="100%">
  <stop offset="0%"  stop-color="rgba(0, 0, 0, 1)" />
  <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
  </linearGradient>
  <linearGradient id="saturation">
  <stop offset="0%"  stop-color="rgba(255, 255, 255, 1)" />
  <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
  </linearGradient>
  </defs>
  

  <rect id="fillBg" width="100%" height="100%" fill="${hsv(hue, 1, 1)}" />
  <rect width="100%" height="100%" fill="url('#saturation')" />
  <rect width="100%" height="100%" fill="url('#value')" />
  
  ${Math.round(hue) === 210 ? bsDots : ''}
  
  ${useLine ? line : scatterPoints}
  </svg>
`;


  if (format === 'svg') {
    console.log(svg.split('\n').map(s => s.trim()).filter(s => s).join('\n'));
  } else {
    console.log(`
  <div class="tableContainer">
  ${htmlTable}
  </div>
  `);
  }
}

main();
