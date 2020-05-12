import {hsv} from "d3-hsv";

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
`.trim().split('\n');


function main() {

  const table = {}
  for (const value of hexValues) {
    table[value] = hsv(value)
  }

  const tableRows = Object.keys(table)
    .map(k => `<tr>
    <td><code data-color>${k}</code></td>
    <td>${isNaN(table[k].h) ? 0 : Math.round(table[k].h)}</td>
    <td>${Math.round((isNaN(table[k].s) ? 1 : table[k].s) * 100)}</td>
    <td>${Math.round(table[k].v * 100)}</td>
  </tr>`)
    .map(s => s.split('\n').map(s => s.trim()).join(''))
    .join('\n');

  const htmlTable = `
  <table class="table">
    <thead>
      <tr><th>hex</th><th>hue</th><th>saturation</th><th>value</th></tr>
    </thead>
  <tbody>
  ${tableRows}
  </tbody>
  </table>
  `;

  console.log(`
  <div class="tableContainer">
  ${htmlTable}
  </div>
  `);
}

main();
