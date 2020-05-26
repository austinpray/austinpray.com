const assert = require('assert').strict;
const {parseColor} = require('../src/parseColor.js');
const {isGrayHCLOpt, hueCurveLCh, lightnessCurveLCh, _buildCurve} = require('../src/lib.js');
const {hueToleranceStops} = require("../src/lib.js");

describe('parseColor', function () {
  it('should grab RGB values from hex', function () {
    assert.deepEqual({r: 255, g: 255, b: 255}, parseColor('#ffffff'));
    assert.deepEqual({r: 255, g: 255, b: 255}, parseColor('#ffffffff'));
    assert.deepEqual({r: 0, g: 0, b: 0}, parseColor('#000000'));
    assert.deepEqual({r: 255, g: 255, b: 255}, parseColor('#fff'));
    assert.deepEqual({r: 255, g: 255, b: 255}, parseColor('#ffff'));
    assert.deepEqual({r: 0, g: 0, b: 0}, parseColor('#000'));
    assert.deepEqual({r: 204, g: 204, b: 204}, parseColor('#cccccc'));
    assert.deepEqual({r: 204, g: 204, b: 204}, parseColor('#CCC'));
  });
});

describe('_buildCurve', function () {
  it('should match simplified stops', function () {
    let stops = [
      [0, 1],
      [100, 3],
    ];
    assert.equal(_buildCurve(stops)(0), 1);
    assert.equal(_buildCurve(stops)(50), 2);
    assert.equal(_buildCurve(stops)(100), 3);
    stops = [
      [0, 1],
      [50, 3],
      [100, 1],
    ];
    assert.equal(_buildCurve(stops)(0), 1);
    assert.equal(_buildCurve(stops)(25), 2);
    assert.equal(_buildCurve(stops)(50), 3);
    assert.equal(_buildCurve(stops)(75), 2);
    assert.equal(_buildCurve(stops)(100), 1);
    stops = [
      [0, 0],
      [100, 1],
    ];
    assert.equal(_buildCurve(stops)(0), 0);
    assert.equal(_buildCurve(stops)(50), 0.5);
    assert.equal(_buildCurve(stops)(100), 1);
  });
  it('should match real stops', function () {
    //assert.equal(hueCurveLCh(0), 3.1);
    //assert.equal(hueCurveLCh(310), 3);
    //assert.equal(hueCurveLCh(95), 3.5);
    //assert.equal(hueCurveLCh(200), 6.5);
    //assert.equal(hueCurveLCh(360), 3.1);
  });
});

describe('isGrayHCLOpt', function () {
  it('should be compatible with html colors', function () {
    const shouldMatch = [
      '#000000', // black
      '#c0c0c0', // silver
      '#808080', // gray
      '#ffffff', // white
      '#696969', // dimgray
      '#696969', // dimgrey
      '#a9a9a9', // darkgray
      '#a9a9a9', // darkgrey
      '#808080', // grey
      '#d3d3d3', // lightgray
      '#d3d3d3', // lightgrey
      '#f0f8ff', // aliceblue
      '#dcdcdc', // gainsboro
      '#f8f8ff', // ghostwhite
      '#fffafa', // snow
      '#f5f5f5', // whitesmoke

      // borderline

      '#fff5ee', // seashell
      '#faf0e6', // linen
    ];

    const ambiguous = [];

    const shouldNotMatch = [
      // should find a way to include these guys
      '#778899', // lightslategray
      '#778899', // lightslategrey
      '#708090', // slategray
      '#708090', // slategrey

      // undecided about these
      '#f0ffff', // azure
      '#fffff0', // ivory
      '#fffaf0', // floralwhite
      '#f0fff0', // honeydew
      '#ffe4c4', // bisque
      '#ffebcd', // blanchedalmond
      '#deb887', // burlywood
      '#fff8dc', // cornsilk
      '#f5f5dc', // beige
      '#faebd7', // antiquewhite

      // yep

      '#800000', // maroon
      '#ff0000', // red
      '#800080', // purple
      '#ff00ff', // fuchsia
      '#008000', // green
      '#00ff00', // lime
      '#808000', // olive
      '#ffff00', // yellow
      '#000080', // navy
      '#0000ff', // blue
      '#008080', // teal
      '#00ffff', // aqua
      '#ffa500', // orange
      '#7fffd4', // aquamarine
      '#8a2be2', // blueviolet
      '#a52a2a', // brown
      '#5f9ea0', // cadetblue
      '#7fff00', // chartreuse
      '#d2691e', // chocolate
      '#ff7f50', // coral
      '#6495ed', // cornflowerblue
      '#dc143c', // crimson
      '#00ffff', // (synonym of aqua)
      '#00008b', // darkblue
      '#008b8b', // darkcyan
      '#b8860b', // darkgoldenrod
      '#006400', // darkgreen
      '#bdb76b', // darkkhaki
      '#8b008b', // darkmagenta
      '#556b2f', // darkolivegreen
      '#ff8c00', // darkorange
      '#9932cc', // darkorchid
      '#8b0000', // darkred
      '#e9967a', // darksalmon
      '#8fbc8f', // darkseagreen
      '#483d8b', // darkslateblue
      '#2f4f4f', // darkslategray
      '#2f4f4f', // darkslategrey
      '#00ced1', // darkturquoise
      '#9400d3', // darkviolet
      '#ff1493', // deeppink
      '#00bfff', // deepskyblue
      '#1e90ff', // dodgerblue
      '#b22222', // firebrick
      '#228b22', // forestgreen
      '#ffd700', // gold
      '#daa520', // goldenrod
      '#adff2f', // greenyellow
      '#ff69b4', // hotpink
      '#cd5c5c', // indianred
      '#4b0082', // indigo
      '#f0e68c', // khaki
      '#e6e6fa', // lavender
      '#fff0f5', // lavenderblush
      '#7cfc00', // lawngreen
      '#fffacd', // lemonchiffon
      '#add8e6', // lightblue
      '#f08080', // lightcoral
      '#e0ffff', // lightcyan
      '#fafad2', // lightgoldenrodyellow
      '#90ee90', // lightgreen
      '#ffb6c1', // lightpink
      '#ffa07a', // lightsalmon
      '#20b2aa', // lightseagreen
      '#87cefa', // lightskyblue
      '#b0c4de', // lightsteelblue
      '#ffffe0', // lightyellow
      '#32cd32', // limegreen
      '#ff00ff', // magenta
      '#66cdaa', // mediumaquamarine
      '#0000cd', // mediumblue
      '#ba55d3', // mediumorchid
      '#9370db', // mediumpurple
      '#3cb371', // mediumseagreen
      '#7b68ee', // mediumslateblue
      '#00fa9a', // mediumspringgreen
      '#48d1cc', // mediumturquoise
      '#c71585', // mediumvioletred
      '#191970', // midnightblue
      '#f5fffa', // mintcream
      '#ffe4e1', // mistyrose
      '#ffe4b5', // moccasin
      '#ffdead', // navajowhite
      '#fdf5e6', // oldlace
      '#6b8e23', // olivedrab
      '#ff4500', // orangered
      '#da70d6', // orchid
      '#eee8aa', // palegoldenrod
      '#98fb98', // palegreen
      '#afeeee', // paleturquoise
      '#db7093', // palevioletred
      '#ffefd5', // papayawhip
      '#ffdab9', // peachpuff
      '#cd853f', // peru
      '#ffc0cb', // pink
      '#dda0dd', // plum
      '#b0e0e6', // powderblue
      '#bc8f8f', // rosybrown
      '#4169e1', // royalblue
      '#8b4513', // saddlebrown
      '#fa8072', // salmon
      '#f4a460', // sandybrown
      '#2e8b57', // seagreen
      '#a0522d', // sienna
      '#87ceeb', // skyblue
      '#6a5acd', // slateblue
      '#00ff7f', // springgreen
      '#4682b4', // steelblue
      '#d2b48c', // tan
      '#d8bfd8', // thistle
      '#ff6347', // tomato
      '#40e0d0', // turquoise
      '#ee82ee', // violet
      '#f5deb3', // wheat
      '#9acd32', // yellowgreen
      '#663399', // rebeccapurple
    ];


    shouldNotMatch.forEach(hex => assert.equal(false, isGrayHCLOpt(hex), `expected ${hex} to NOT be gray`));
    shouldMatch.forEach(hex => assert.equal(true, isGrayHCLOpt(hex), `expected ${hex} to be gray`));
  });
  it('should match grayscale colors', function () {

    const gs = [
      '#FFFFFF',
      '#EEEEEE',
      '#DDDDDD',
      '#CCCCCC',
      '#BBBBBB',
      '#AAAAAA',
      '#999999',
      '#888888',
      '#777777',
      '#666666',
      '#555555',
      '#444444',
      '#333333',
      '#222222',
      '#111111',
      '#000000',
    ];
    gs.forEach(hex => assert.equal(true, isGrayHCLOpt(hex), `expected ${hex} to be gray`));

  });
  it('should match bootstrap colors', function () {
    const bs = [
      '#f8f9fa',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#6c757d',
      '#495057',
      '#343a40',
      '#212529',
    ];
    bs.forEach(hex => assert.equal(true, isGrayHCLOpt(hex), `expected ${hex} to be gray`));

  });
  it('should match pantone warm grays', function () {
    const pantoneWarmGray = [
      '#d7d2cb',
      '#cbc4bc',
      '#bfb8af',
      '#b6ada5',
      '#aca39a',
      '#a59c94',
      '#968c83',
      '#8c8279',
      '#83786f',
      '#796e65',
      '#6e6259',
    ];
    pantoneWarmGray.forEach(hex => assert.equal(true, isGrayHCLOpt(hex), `expected ${hex} to be gray`));
  });
  it('should match pantone cool grays', function () {
    const pantoneCoolGrays = [
      '#d9d9d6',
      '#d0d0ce',
      '#c8c9c7',
      '#bbbcbc',
      '#b1b3b3',
      '#a7a8a9',
      '#97999b',
      '#888b8d',
      '#75787b',
      '#63666a',
      '#53565a',
    ];
    pantoneCoolGrays.forEach(hex => assert.equal(true, isGrayHCLOpt(hex), `expected ${hex} to be gray`));
  });
  it('should not match offensive greens', function () {
    const offensive = [
      '#f0fff0',
      '#ebfaeb',
      '#dff0df',
      '#cedece',
      '#a0b0a0',
      '#5d6e5d',
      '#415241',
      '#2a3b2a',
      '#011201',
    ];
    offensive.forEach(hex => assert.equal(false, isGrayHCLOpt(hex), `expected ${hex} to NOT be gray`));
  })
  it('should match tasteful grays', function () {
    const taste = [
      '#f8f3f3',
      '#fbfefb',
      '#f1f5f9',
      '#7a7373',
      '#7c7e7c',
      '#71777d',
      '#3c3635',
      '#3d3f3d',
      '#34383c',
    ];
    taste.forEach(hex => assert.equal(true, isGrayHCLOpt(hex), `expected ${hex} to be gray`));
  });
  it('should match tailwind grays', function () {
    const tw = [
      '#F7FAFC',
      '#EDF2F7',
      '#E2E8F0',
      //'#CBD5E0',
      //'#A0AEC0',
      //'#718096',
      //'#4A5568',
      //'#2D3748',
      //'#1A202C',
    ];
    tw.forEach(hex => assert.equal(true, isGrayHCLOpt(hex), `expected ${hex} to be gray`));
  });
});
