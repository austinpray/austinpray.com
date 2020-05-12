const {getEdges} = require("./src/find-edges.js");
const {isGrayHCLOpt} = require("./src/lib.js");
const {hsv} = require('d3-hsv');
const {lch} = require('d3-color');

const edges = [];

for (let hue = 0; hue <= 360; hue++) {
  edges.push(getEdges(hue, {curve: isGrayHCLOpt}));
}

const sampleEvery = nth => (arr => arr.filter((_, i) => i % nth === 0));

const sampledEdges = edges.map(sampleEvery(10));
const edgesByHue = sampleEvery(5)(sampledEdges)

console.log(`
<div class="tableContainer">
<table class="table finalTable">
<tbody>
<tr>
<td></td>
<td style="background: white">#ffffff</td>
<td colspan="8"></td>
<td style="background: black; color: white">#000000</td>
</tr>
${edgesByHue.map(edges => {
  const hsvHue = hsv(edges[0].h, 1, 1);
  const lchHue = lch(edges[0]);
  return `<tr>
<td style="background:${hsvHue}">${hsvHue.h}&deg;&nbsp;HSV / 
${Math.round(lchHue.h)}&deg;&nbsp;LCh</td>
${edges.map(
      edge => `<td style="background:${edge}">${edge.formatHex()}</td>`
    ).join('')}
</tr>`
}).join('\n')}
</tbody>
</table>
</div>
`)
