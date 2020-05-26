---
layout: post 
title: "Detecting Grayscale Colors" 
date: 2020-05-25
---

<style>
{% include 2020-05-25-detecting-grayscale-colors/style.css %}
</style>


Let's say you want to detect some [grayscale][] colors:

<div style="display: flex; align-items: center">
<div><code>isGrayscale(</code></div>
<div class="colorScale" style="flex: 1">
    <div style="background:#FFFFFF"></div>
    <div style="background:#EEEEEE"></div>
    <div style="background:#DDDDDD"></div>
    <div style="background:#CCCCCC"></div>
    <div style="background:#BBBBBB"></div>
    <div style="background:#AAAAAA"></div>
    <div style="background:#999999"></div>
    <div style="background:#888888"></div>
    <div style="background:#777777"></div>
    <div style="background:#666666"></div>
    <div style="background:#555555"></div>
    <div style="background:#444444"></div>
    <div style="background:#333333"></div>
    <div style="background:#222222"></div>
    <div style="background:#111111"></div>
    <div style="background:#000000"></div>
</div>
<div><code>)</code></div>
</div>
<div>
<code>// returns true</code>
</div>

A color is grayscale if the color's [red, green, blue (RGB)][rgb] component values are exactly equal.
A really common format for colors on the web is a 6 digit hexidecimal representation of the RGB component values:
<code style="background: #f1f1f1"># + <span style="color:red">RR</span><span style="color:green">GG</span><span style="color:blue">BB</span></code>.

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(13em, 1fr));">
<li><code data-color>#FFFFFF</code></li>
<li><code data-color>#000000</code></li>
<li><code data-color>#808080</code></li>
<li><code data-color>#FF0000</code></li>
<li><code data-color>#00FF00</code></li>
<li><code data-color>#0000FF</code></li>
</ul>

Knowing the above, detecting grayscale colors is simple:

```js
function isGrayscale(color) {
  const { r, g, b } = parseColor(color);

  return r === g && r === b;
}

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
```

<div style="overflow-x: auto">
<table class="table" style="width: inherit">
<tbody>
<tr><td><code>isGrayscale('<span data-color>#FFFFFF</span>')</code></td><td>✅</td></tr>
<tr><td><code>isGrayscale('<span data-color>#000000</span>')</code></td><td>✅</td></tr>
<tr><td><code>isGrayscale('<span data-color>#808080</span>')</code></td><td>✅</td></tr>
<tr><td><code>isGrayscale('<span data-color>#FF0000</span>')</code></td><td>❌</td></tr>
<tr><td><code>isGrayscale('<span data-color>#00FF00</span>')</code></td><td>❌</td></tr>
<tr><td><code>isGrayscale('<span data-color>#0000FF</span>')</code></td><td>❌</td></tr>
</tbody>
</table>
</div>


Be aware that there are a [boatload of valid formats for web colors][valid-colors].
For production use you are better off using a library like [`d3-color`][] to parse untrusted color values.

Anyway, the above code works great! I guess we are done. Hope you learned something! I should blog more often.
See you next time!

Wait, what was that? You plugged some [Bootstrap 4 gray colors][bootstrap-colors] into the function like
<code>isGrayscale('<span data-color>#adb5bd</span>')</code> and you got `false`?
Well, I would indeed consider those Bootstrap grays to be "grayish" colors.
However, those colors are not strictly grayscale colors according to the definition we agreed
upon above. So yeah, it's actually a _good_ thing our function doesn't match them. Closed as <code>wontfix</code>.

What? This blog post sucks? Okay, fine, there's more we can do here. I'm no stranger to scope creep.

## Classifying colors as "grayish"

A color is generally considered "grayish", neutral, achromatic if all of its
[red, green, blue (RGB)][rgb] component values are a close distance to each other.
Makes sense: we know from earlier that a color is strictly grayscale if it has uniform RGB values.
A distance of zero is about as close as you can get.

Let's define our test cases.
We can use those pesky [Bootstrap 4 gray colors][bootstrap-colors] as colors we want to positively match.

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(13em, 1fr));">
<li><code>gray-100: <span data-color>#f8f9fa</span></code></li>
<li><code>gray-200: <span data-color>#e9ecef</span></code></li>
<li><code>gray-300: <span data-color>#dee2e6</span></code></li>
<li><code>gray-400: <span data-color>#ced4da</span></code></li>
<li><code>gray-500: <span data-color>#adb5bd</span></code></li>
<li><code>gray-600: <span data-color>#6c757d</span></code></li>
<li><code>gray-700: <span data-color>#495057</span></code></li>
<li><code>gray-800: <span data-color>#343a40</span></code></li>
<li><code>gray-900: <span data-color>#212529</span></code></li>
</ul>

As a sanity check let's use [ColorBrewer 2][] as colors we want to negatively match.

Let's visualize the RGB values of our test cases and check if we see the pattern we expect.

<table class="table">
<tbody>
<tr>
<th>True Grayscale</th>
<td>
<div class="colorScale" style="margin-bottom: 0.5em">
    <div style="background:#222222"></div>
    <div style="background:#333333"></div>
    <div style="background:#444444"></div>
    <div style="background:#666666"></div>
    <div style="background:#aaaaaa"></div>
    <div style="background:#cccccc"></div>
    <div style="background:#dddddd"></div>
    <div style="background:#eeeeee"></div>
    <div style="background:#ffffff"></div>
</div>

<svg viewBox="0 0 256 18" class="figure">
<!-- #fff -->
<circle cx="255" cy="1" r="1" fill="red" />
<circle cx="255" cy="1" r="1" fill="green" />
<circle cx="255" cy="1" r="1" fill="blue" />
<!-- #eee -->
<circle cx="238" cy="3" r="1" fill="red" />
<circle cx="238" cy="3" r="1" fill="green" />
<circle cx="238" cy="3" r="1" fill="blue" />
<!-- #ddd -->
<circle cx="221" cy="5" r="1" fill="red" />
<circle cx="221" cy="5" r="1" fill="green" />
<circle cx="221" cy="5" r="1" fill="blue" />
<!-- #ccc -->
<circle cx="204" cy="7" r="1" fill="red" />
<circle cx="204" cy="7" r="1" fill="green" />
<circle cx="204" cy="7" r="1" fill="blue" />
<!-- #aaa -->
<circle cx="170" cy="9" r="1" fill="red" />
<circle cx="170" cy="9" r="1" fill="green" />
<circle cx="170" cy="9" r="1" fill="blue" />
<!-- #666 -->
<circle cx="102" cy="11" r="1" fill="red" />
<circle cx="102" cy="11" r="1" fill="green" />
<circle cx="102" cy="11" r="1" fill="blue" />
<!-- #444 -->
<circle cx="68" cy="13" r="1" fill="red" />
<circle cx="68" cy="13" r="1" fill="green" />
<circle cx="68" cy="13" r="1" fill="blue" />
<!-- #333 -->
<circle cx="51" cy="15" r="1" fill="red" />
<circle cx="51" cy="15" r="1" fill="green" />
<circle cx="51" cy="15" r="1" fill="blue" />
<!-- #222 -->
<circle cx="34" cy="17" r="1" fill="red" />
<circle cx="34" cy="17" r="1" fill="green" />
<circle cx="34" cy="17" r="1" fill="blue" />
</svg>
</td>
</tr>




<tr>
<th>Bootstrap 4</th>
<td>
<div class="colorScale" style="margin-bottom: 0.5em">
<div style="background:#212529"></div>
<div style="background:#343a40"></div>
<div style="background:#495057"></div>
<div style="background:#6c757d"></div>
<div style="background:#adb5bd"></div>
<div style="background:#ced4da"></div>
<div style="background:#dee2e6"></div>
<div style="background:#e9ecef"></div>
<div style="background:#f8f9fa"></div>
</div>

<svg viewBox="0 0 255 18" class="figure">
<!-- #f8f9fa -->
<circle cx="248" cy="1" r="1" fill="red" />
<circle cx="249" cy="1" r="1" fill="green" />
<circle cx="250" cy="1" r="1" fill="blue" />
<!-- #e9ecef -->
<circle cx="233" cy="3" r="1" fill="red" />
<circle cx="236" cy="3" r="1" fill="green" />
<circle cx="239" cy="3" r="1" fill="blue" />
<!-- #dee2e6 -->
<circle cx="222" cy="5" r="1" fill="red" />
<circle cx="226" cy="5" r="1" fill="green" />
<circle cx="230" cy="5" r="1" fill="blue" />
<!-- #ced4da -->
<circle cx="206" cy="7" r="1" fill="red" />
<circle cx="212" cy="7" r="1" fill="green" />
<circle cx="218" cy="7" r="1" fill="blue" />
<!-- #adb5bd -->
<circle cx="173" cy="9" r="1" fill="red" />
<circle cx="181" cy="9" r="1" fill="green" />
<circle cx="189" cy="9" r="1" fill="blue" />
<!-- #6c757d -->
<circle cx="108" cy="11" r="1" fill="red" />
<circle cx="117" cy="11" r="1" fill="green" />
<circle cx="125" cy="11" r="1" fill="blue" />
<!-- #495057 -->
<circle cx="73" cy="13" r="1" fill="red" />
<circle cx="80" cy="13" r="1" fill="green" />
<circle cx="87" cy="13" r="1" fill="blue" />
<!-- #343a40 -->
<circle cx="52" cy="15" r="1" fill="red" />
<circle cx="58" cy="15" r="1" fill="green" />
<circle cx="64" cy="15" r="1" fill="blue" />
<!-- #212529 -->
<circle cx="33" cy="17" r="1" fill="red" />
<circle cx="37" cy="17" r="1" fill="green" />
<circle cx="41" cy="17" r="1" fill="blue" />
</svg>
</td>
</tr>



<tr>
<th>ColorBrewer 2</th>
<td>
<div class="colorScale" style="margin-bottom: 0.5em">
<div style="background:rgb(128,0,38)"></div>
<div style="background:rgb(189,0,38)"></div>
<div style="background:rgb(227,26,28)"></div>
<div style="background:rgb(252,78,42)"></div>
<div style="background:rgb(253,141,60)"></div>
<div style="background:rgb(254,178,76)"></div>
<div style="background:rgb(254,217,118)"></div>
<div style="background:rgb(255,237,160)"></div>
<div style="background:rgb(255,255,204)"></div>
</div>

<svg viewBox="0 0 257 18" class="figure">

<circle cx="255" cy="1" r="1" fill="red" />
<circle cx="255" cy="1" r="1" fill="green" />
<circle cx="204" cy="1" r="1" fill="blue" />

<circle cx="255" cy="3" r="1" fill="red" />
<circle cx="237" cy="3" r="1" fill="green" />
<circle cx="160" cy="3" r="1" fill="blue" />

<circle cx="254" cy="5" r="1" fill="red" />
<circle cx="217" cy="5" r="1" fill="green" />
<circle cx="118" cy="5" r="1" fill="blue" />

<circle cx="254" cy="7" r="1" fill="red" />
<circle cx="178" cy="7" r="1" fill="green" />
<circle cx="76"  cy="7" r="1" fill="blue" />

<circle cx="253" cy="9" r="1" fill="red" />
<circle cx="141" cy="9" r="1" fill="green" />
<circle cx="60"  cy="9" r="1" fill="blue" />

<circle cx="252" cy="11" r="1" fill="red" />
<circle cx="78"  cy="11" r="1" fill="green" />
<circle cx="42"  cy="11" r="1" fill="blue" />

<circle cx="227" cy="13" r="1" fill="red" />
<circle cx="26"  cy="13" r="1" fill="green" />
<circle cx="28"  cy="13" r="1" fill="blue" />

<circle cx="189" cy="15" r="1" fill="red" />
<circle cx="0"   cy="15" r="1" fill="green" />
<circle cx="38"  cy="15" r="1" fill="blue" />

<circle cx="128" cy="17" r="1" fill="red" />
<circle cx="0"   cy="17" r="1" fill="green" />
<circle cx="38"  cy="17" r="1" fill="blue" />

</svg>
</td>
</tr>

</tbody>
</table>

<!--
#f8f9fa
#e9ecef
#dee2e6
#ced4da
#adb5bd
#6c757d
#495057
#343a40
#212529
-->

Okay, so we can clearly see the pattern we expect. The colors we want to match have equidistant RGB components.
The ColorBrewer colors are off doing their own thing because they are clearly not gray colors.

If we want to classify these colors in code: we need a way to measure the degree to which the RGB components are close to each other.
The [range][range] of the RGB components should measure this nicely.

```js
const RANGE_LIMIT = 17;

function isGray(color) {
  const { r, g, b } = parseColor(color);
  const rgb = [r, g, b];
  return Math.max(...rgb) - Math.min(...rgb) <= RANGE_LIMIT;
}
```
<details>
<summary>Where do we get <code>RANGE_LIMIT</code>?</summary>
<table class="table">
<thead><tr><th></th><th>red</th><th>green</th><th>blue</th><th>range</th></tr></thead>
<tbody>
 <tr><td><span data-color>#f8f9fa</span></td><td>248</td><td>249</td><td>250</td><td>2</td></tr>
 <tr><td><span data-color>#e9ecef</span></td><td>233</td><td>236</td><td>239</td><td>6</td></tr>
 <tr><td><span data-color>#dee2e6</span></td><td>222</td><td>226</td><td>230</td><td>8</td></tr>
 <tr><td><span data-color>#ced4da</span></td><td>206</td><td>212</td><td>218</td><td>12</td></tr>
 <tr><td><span data-color>#adb5bd</span></td><td>173</td><td>181</td><td>189</td><td>16</td></tr>
 <tr><td><span data-color>#6c757d</span></td><td>108</td><td>117</td><td>125</td><td><mark>17</mark></td></tr>
 <tr><td><span data-color>#495057</span></td><td>73</td><td>80</td><td>87</td>   <td>14</td></tr>
 <tr><td><span data-color>#343a40</span></td><td>52</td><td>58</td><td>64</td>   <td>12</td></tr>
 <tr><td><span data-color>#212529</span></td><td>33</td><td>37</td><td>41</td>   <td>8</td></tr>
</tbody></table>
</details>

This matches the original desired Bootstrap colors:

<div class="colorScale">
<div style="background:rgb(248, 249, 250)"></div>
<div style="background:rgb(233, 236, 239)"></div>
<div style="background:rgb(222, 226, 230)"></div>
<div style="background:rgb(206, 212, 218)"></div>
<div style="background:rgb(173, 181, 189)"></div>
<div style="background:rgb(108, 117, 125)"></div>
<div style="background:rgb(73, 80, 87)"></div>
<div style="background:rgb(52, 58, 64)"></div>
<div style="background:rgb(33, 37, 41)"></div>
</div>

Similar "grayish" colors will be matched as well:

<div class="colorScale">
<div style="background:rgb(248, 248, 250)"></div>
<div style="background:rgb(233, 233, 239)"></div>
<div style="background:rgb(222, 222, 230)"></div>
<div style="background:rgb(206, 206, 218)"></div>
<div style="background:rgb(173, 173, 189)"></div>
<div style="background:rgb(108, 108, 125)"></div>
<div style="background:rgb(73, 73, 87)"></div>
<div style="background:rgb(52, 52, 64)"></div>
<div style="background:rgb(33, 33, 41)"></div>
</div>
<div class="colorScale">
<div style="background:rgb(248, 249, 249)"></div>
<div style="background:rgb(233, 236, 236)"></div>
<div style="background:rgb(222, 226, 226)"></div>
<div style="background:rgb(206, 212, 212)"></div>
<div style="background:rgb(173, 181, 181)"></div>
<div style="background:rgb(108, 117, 117)"></div>
<div style="background:rgb(73, 80, 80)"></div>
<div style="background:rgb(52, 58, 58)"></div>
<div style="background:rgb(33, 37, 37)"></div>
</div>
<div class="colorScale">
<div style="background:rgb(248,249,250)"></div>
<div style="background:rgb(235,236,235)"></div>
<div style="background:rgb(225,226,225)"></div>
<div style="background:rgb(211,212,211)"></div>
<div style="background:rgb(180,181,180)"></div>
<div style="background:rgb(116,117,116)"></div>
<div style="background:rgb(79,80,79)"></div>
<div style="background:rgb(57,58,57)"></div>
<div style="background:rgb(36,37,36)"></div>
</div>
<div class="colorScale">
    <div style="background:#ffffff"></div>
    <div style="background:#eeeeee"></div>
    <div style="background:#dddddd"></div>
    <div style="background:#cccccc"></div>
    <div style="background:#aaaaaa"></div>
    <div style="background:#666666"></div>
    <div style="background:#444444"></div>
    <div style="background:#333333"></div>
    <div style="background:#222222"></div>
</div>

Great! Looks good to me so far.
Now, how can we exhaustively prove that this function matches only the colors we want?
The best way to spot check our function is probably to visualize what it considers to be "grayish".

## Checking our work

[RGB][] is a nice and simple color model that is easy for machines to deal with.
However, for our purposes here it would be nice to use a human-friendly color model.
I will choose the [hue, saturation, value (HSV)][hsv] color model to make a simple 2D plot of the colors matched by our function.

[HSV][hsv] has some useful geometry for detecting and visualizing grayish colors.
The HSV color model can be represented as a cylinder where the central vertical axis comprises 
neutral, achromatic, or gray colors. Those colors range, from top to bottom, white at value 1 and black at value 0.

<blockquote>
<img src="/assets/960px-HSV_color_solid_cylinder_saturation_gray.png" alt="hsv cylinder" class="figure" />
By HSV_color_solid_cylinder.png: SharkDderivative work: SharkD  Talk - HSV_color_solid_cylinder.png, CC BY-SA 3.0,
<a href="https://commons.wikimedia.org/w/index.php?curid=9801673">wiki</a>
</blockquote>

I'm not smart enough to do math in 3D: so let's just chart 2D slices of this cylinder at different hues and see how far we get.
We are mostly concerned with the interaction between saturation and value right now anyway.
Let's fix the hue to
<code data-color="hsl(210 100% 50%)">210°</code>.
since all those Bootstrap grays tend to hover around that hue.

<figure>
<div class="sxs">
{% include 2020-05-25-detecting-grayscale-colors/range.html %}
</div>
<figcaption>
The <span data-color>blue</span> line is the maximum color matched by <code>isGray</code>
when it is fed colors with a hue fixed at
<code data-color="hsl(210 100% 50%)">210°</code>.
Colors below this line will be matched.
Our target Bootstrap colors are plotted in <span data-color>red</span>.
</figcaption>
</figure>

<div class="colorScale" style="margin-bottom: 0.5em">
<div style="background:#f0f7ff"></div>
<div style="background:#ebf2fa"></div>
<div style="background:#dfe7f0"></div>
<div style="background:#ced6de"></div>
<div style="background:#a0a8b0"></div>
<div style="background:#5d656e"></div>
<div style="background:#414952"></div>
<div style="background:#2a323b"></div>
<div style="background:#010912"></div>
</div>

Great! Not perfect, but it's definitely clear to me that we are on the right track.
  
Let's check another hue to see what our function matches there. Let's check the
<code data-color="hsl(120 100% 50%)">120°</code> hue.

<figure>
<div class="sxs">
{% include 2020-05-25-detecting-grayscale-colors/range-green.html %}
</div>
</figure>

Uhoh. Yeah, this isn't working at all.
Most all of these matched colors look downright green to me on all my devices.
At best, it seems to be matching greens that look like olive drab.

<div class="colorScale" style="margin-bottom: 0.5em">
<div style="background:#f0fff0"></div>
<div style="background:#ebfaeb"></div>
<div style="background:#dff0df"></div>
<div style="background:#cedece"></div>
<div style="background:#a0b0a0"></div>
<div style="background:#5d6e5d"></div>
<div style="background:#415241"></div>
<div style="background:#2a3b2a"></div>
<div style="background:#011201"></div>
</div>

If you are not familiar with color spaces: you might be wondering
how <code data-color>#f0f7ff</code> and <code data-color>#f0fff0</code>
can have the same saturation (6) and value (100) yet <code data-color>#f0fff0</code>
is disproportionately offensive.
Due to [the way color vision works](https://en.wikipedia.org/wiki/Color_vision#Physiology_of_color_perception),
we are naturally more sensitive to colors in the greenish-yellow area of the color spectrum.
So we need to use a [perceptually uniform color model][cie] that accounts for this.


## Perceiving colors in code

Let's tighten up our terminology in the hopes of finding a good color model for our problem.
Classifying colors as "grayish" can be more accurately stated as classifying:

- neutral colors
- colors with low colorfulness
- colors with low saturation
- achromatic colors, colors with a low chroma value

If we are looking for achromatic colors, we have the [CIELCh<sub>ab</sub>][lch]
perceptual color model at our disposal. This is a cylindrical representation of the [CIELAB][lab]
color space with a channel for **L**ightness, **C**hroma, and **h**ue.
The chroma channel is what we will use to determine if a color is achromatic enough to be matched.
<code data-color>#6c757d</code> from our bootstrap colors has the highest chroma value at <code>6.05</code>.
Let's use that as our threshold.

```js
import { lch } from 'd3-color';

const CHROMA_THRESHOLD = 6.05;

function isGray(color) {
  let chroma = lch(color).c;
  return isNaN(chroma) || chroma <= CHROMA_THRESHOLD;
}
```

Let's chart it at the
<code data-color="hsl(210 100% 50%)">210°</code> hue:

<figure>
<div class="sxs">
{% include 2020-05-25-detecting-grayscale-colors/hcl-bootstrap.html %}
</div>
<figcaption>
The <span data-color>blue</span> line is our new LCh-based <code>isGray</code>.
The <span data-color>purple</span> line is our old range-based <code>isGray</code>.
Great! It's mostly the same as our previous function. 
Glad to see we weren't completely off-base with our previous idea.
</figcaption>
</figure>


Let's chart it at the
<code data-color="hsl(120 100% 50%)">120°</code> hue:

<figure>
<div class="sxs">
{% include 2020-05-25-detecting-grayscale-colors/hcl-green.html %}
</div>
<figcaption>
The <span data-color>blue</span> line is our new LCh-based <code>isGray</code>.
The <span data-color>purple</span> line is our old range-based <code>isGray</code>.
You can see the LCh-based curve is way more reluctant to match saturated colors for a given brightness at this hue.
It plays it safe and sticks closer to the Y axis.
</figcaption>
</figure>

For completeness let's try 
Let's chart it at the
<code data-color="hsl(0 100% 50%)">0°</code> hue:

<figure>
<div class="sxs">
{% include 2020-05-25-detecting-grayscale-colors/hcl-red.html %}
</div>
<figcaption>
The <span data-color>blue</span> line is our new LCh-based <code>isGray</code>.
The <span data-color>purple</span> line is our old range-based <code>isGray</code>.
</figcaption>
</figure>

Let's sample the edge case colors:


<div class="colorbox" style="background: #454545">
<code style="background:#fff0f0">#fff0f0</code>
<code style="background:#f7fff7">#f7fff7</code>
<code style="background:#edf6ff">#edf6ff</code>

<code style="background:#807171">#807171</code>
<code style="background:#778077">#778077</code>
<code style="background:#6f7780">#6f7780</code>

<code style="background:#403434">#403434</code>
<code style="background:#384038">#384038</code>
<code style="background:#313840">#313840</code>
</div>

<div class="colorbox" style="background: #c0c0c0">
<code style="background:#fff0f0">#fff0f0</code>
<code style="background:#f7fff7">#f7fff7</code>
<code style="background:#edf6ff">#edf6ff</code>

<code style="background:#807171">#807171</code>
<code style="background:#778077">#778077</code>
<code style="background:#6f7780">#6f7780</code>

<code style="background:#403434">#403434</code>
<code style="background:#384038">#384038</code>
<code style="background:#313840">#313840</code>
</div>

<div class="colorbox" style="background: #fff">
<code style="background:#fff0f0">#fff0f0</code>
<code style="background:#f7fff7">#f7fff7</code>
<code style="background:#edf6ff">#edf6ff</code>

<code style="background:#807171">#807171</code>
<code style="background:#778077">#778077</code>
<code style="background:#6f7780">#6f7780</code>

<code style="background:#403434">#403434</code>
<code style="background:#384038">#384038</code>
<code style="background:#313840">#313840</code>
</div>

We are definitely getting somewhere.
At this point I'm beginning to doubt my monitor calibration/eyes.
Regardless, I'm gonna go ahead and judge that most people would struggle to classify the above colors as "gray".
If I asked people to name those colors I'm guessing they would say things like 
"pale blue", "olive drab", "dark blue".

Here's an example of me manually tweaking these colors in an LCh color picker until
I personally would call them "gray".


<div class="colorbox" style="background: #454545">
<code style="background:#f8f3f3">#f8f3f3</code>
<code style="background:#fbfefb">#fbfefb</code>
<code style="background:#f1f5f9">#f1f5f9</code>

<code style="background:#7a7373">#7a7373</code>
<code style="background:#7c7e7c">#7c7e7c</code>
<code style="background:#71777d">#71777d</code>

<code style="background:#3c3635">#3c3635</code>
<code style="background:#3d3f3d">#3d3f3d</code>
<code style="background:#34383c">#34383c</code>
</div>

<div class="colorbox" style="background: #c0c0c0">
<code style="background:#f8f3f3">#f8f3f3</code>
<code style="background:#fbfefb">#fbfefb</code>
<code style="background:#f1f5f9">#f1f5f9</code>

<code style="background:#7a7373">#7a7373</code>
<code style="background:#7c7e7c">#7c7e7c</code>
<code style="background:#71777d">#71777d</code>

<code style="background:#3c3635">#3c3635</code>
<code style="background:#3d3f3d">#3d3f3d</code>
<code style="background:#34383c">#34383c</code>
</div>

<div class="colorbox" style="background: #fff">
<code style="background:#f8f3f3">#f8f3f3</code>
<code style="background:#fbfefb">#fbfefb</code>
<code style="background:#f1f5f9">#f1f5f9</code>

<code style="background:#7a7373">#7a7373</code>
<code style="background:#7c7e7c">#7c7e7c</code>
<code style="background:#71777d">#71777d</code>

<code style="background:#3c3635">#3c3635</code>
<code style="background:#3d3f3d">#3d3f3d</code>
<code style="background:#34383c">#34383c</code>
</div>

That is the best I could do in 10 minutes or so.
I'm hesitant to tweak further as there are so many equipment and biological factors
that could cause me to waste a ton of time with diminising returns.
[The limitations of human vision](http://persci.mit.edu/pub_pdfs/gazzan.pdf)
could certainly trip me up.

> ![optical illusion](/assets/gray/16adelson.jpg)

Anyway, the above exercise of manually finding the chroma threshold for those example colors was useful.
Let's encode my common sense judgement above into an algorithm.

## Coding common sense

When determining a chroma threshold for our algorithm, we should consider these findings from above:

- Blue colors should be given lots of leeway. Blues with a low chroma look like "cool grays" to me.
- Orange colors should be given lots of leeway.
  Orange is a gateway to brown. Oranges with low chroma look like "warm grays" to me.
- Red colors should be judged somewhere in the middle.
- Green colors should be scrutinized closely.

Let's slice up our 3D problem into 2D projections and 
apply some shader functions to our classifier curves to approximate our desired result.

```js
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

const hueCurveLCh = _buildCurve(hueToleranceStopsV1);

function isGray(color) {
  const {l: lightness, c: chroma, h: hue} = lch(color);
  // black and white
  if ([0, 100].includes(lightness)) {
    return true;
  }
  // grayscale
  if (chroma === 0) {
    return true;
  }
  return chroma <= hueCurveLCh(hue)
}
```

Below is a visualization of `hueCurveLCh`:

<figure>
<img src="/assets/gray/hue-curve.svg" alt="hue sensitivity">
<figcaption>The <span data-color>blue</span> line is how much leeway I want to give our
chroma threshold for a given hue. The higher the value the more leeway we give it.</figcaption>
</figure>

Let's dump all the edge case values this function matches. The following table shows
the **most** chromatic colors matched for a given hue and lightness.
These colors sit at the threshold of what this function considers "gray".

{% include 2020-05-25-detecting-grayscale-colors/final-table.html %}

Looking pretty good to me!

### Color palettes classified as gray

#### Bootstrap grays ✅

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(13em, 1fr));">
<li><code>gray-100: <span data-color>#f8f9fa</span></code></li>
<li><code>gray-200: <span data-color>#e9ecef</span></code></li>
<li><code>gray-300: <span data-color>#dee2e6</span></code></li>
<li><code>gray-400: <span data-color>#ced4da</span></code></li>
<li><code>gray-500: <span data-color>#adb5bd</span></code></li>
<li><code>gray-600: <span data-color>#6c757d</span></code></li>
<li><code>gray-700: <span data-color>#495057</span></code></li>
<li><code>gray-800: <span data-color>#343a40</span></code></li>
<li><code>gray-900: <span data-color>#212529</span></code></li>
</ul>

#### PANTONE cool grays ✅

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(13em, 1fr));">
<li>1C: <code data-color>#d9d9d6</code></li>
<li>2C: <code data-color>#d0d0ce</code></li>
<li>3C: <code data-color>#c8c9c7</code></li>
<li>4C: <code data-color>#bbbcbc</code></li>
<li>5C: <code data-color>#b1b3b3</code></li>
<li>6C: <code data-color>#a7a8a9</code></li>
<li>7C: <code data-color>#97999b</code></li>
<li>8C: <code data-color>#888b8d</code></li>
<li>9C: <code data-color>#75787b</code></li>
<li>10C: <code data-color>#63666a</code></li>
<li>11C: <code data-color>#53565a</code></li>
</ul>

#### PANTONE warm grays ✅

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(13em, 1fr));">
<li>1C: <code data-color>#d7d2cb</code></li>
<li>2C: <code data-color>#cbc4bc</code></li>
<li>3C: <code data-color>#bfb8af</code></li>
<li>4C: <code data-color>#b6ada5</code></li>
<li>5C: <code data-color>#aca39a</code></li>
<li>6C: <code data-color>#a59c94</code></li>
<li>7C: <code data-color>#968c83</code></li>
<li>8C: <code data-color>#8c8279</code></li>
<li>9C: <code data-color>#83786f</code></li>
<li>10C: <code data-color>#796e65</code></li>
<li>11C: <code data-color>#6e6259</code></li>
</ul>

#### CSS Colors ✅

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14em, 1fr));">
<li><code>black <span data-color>#000000 </span></code></li>
<li><code>silver <span data-color>#c0c0c0 </span></code></li>
<li><code>gray <span data-color>#808080 </span></code></li>
<li><code>white <span data-color>#ffffff </span></code></li>
<li><code>dimgray <span data-color>#696969 </span></code></li>
<li><code>dimgrey <span data-color>#696969 </span></code></li>
<li><code>darkgray <span data-color>#a9a9a9 </span></code></li>
<li><code>darkgrey <span data-color>#a9a9a9 </span></code></li>
<li><code>grey <span data-color>#808080 </span></code></li>
<li><code>lightgray <span data-color>#d3d3d3 </span></code></li>
<li><code>lightgrey <span data-color>#d3d3d3 </span></code></li>
<li><code>aliceblue <span data-color>#f0f8ff </span></code></li>
<li><code>gainsboro <span data-color>#dcdcdc </span></code></li>
<li><code>ghostwhite <span data-color>#f8f8ff </span></code></li>
<li><code>snow <span data-color>#fffafa </span></code></li>
<li><code>whitesmoke <span data-color>#f5f5f5 </span></code></li>
<li><code>seashell <span data-color>#fff5ee </span></code></li>
<li><code>linen <span data-color>#faf0e6 </span></code></li>
</ul>

(I slightly disagree with `aliceblue` but gonna leave it for now)

### Color palettes _not_ classified as gray

A lot of these are blues with chroma values way above what I'm willing to match
with the current implementation of the function.
I could treat blues as special, but I'm gonna leave it be for now.

#### CSS "Slate Gray" ❌

I would like to match these guys eventually.

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14em, 1fr));">
<li><code>lightslategray: <span data-color>#778899</span></code></li>
<li><code>lightslategrey: <span data-color>#778899</span></code></li> 
<li><code>slategray: <span data-color>#708090</span>     </code></li> 
<li><code>slategrey: <span data-color>#708090</span>     </code></li> 
</ul>

#### Light CSS Colors ❌

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14em, 1fr));">
<li><code>azure <span data-color>#f0ffff </span></code></li>
<li><code>ivory <span data-color>#fffff0 </span></code></li>
<li><code>floralwhite <span data-color>#fffaf0 </span></code></li>
<li><code>honeydew <span data-color>#f0fff0 </span></code></li>
<li><code>bisque <span data-color>#ffe4c4 </span></code></li>
<li><code>blanchedalmond <span data-color>#ffebcd </span></code></li>
<li><code>burlywood <span data-color>#deb887 </span></code></li>
<li><code>cornsilk <span data-color>#fff8dc </span></code></li>
<li><code>beige <span data-color>#f5f5dc </span></code></li>
<li><code>antiquewhite <span data-color>#faebd7 </span></code></li>
</ul>

#### Tailwind CSS "grays" ❌

Matching these made my blue hue edge cases kinda bogus looking. I tend to agree with my function above.
These look like blue colors to me: not gray.

<ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(13em, 1fr));">
<li>100: <code data-color>#F7FAFC</code> ✅</li>
<li>200: <code data-color>#EDF2F7</code> ✅</li>
<li>300: <code data-color>#E2E8F0</code> ✅</li>
<li>400: <code data-color>#CBD5E0</code> ❌</li>
<li>500: <code data-color>#A0AEC0</code> ❌</li>
<li>600: <code data-color>#718096</code> ❌</li>
<li>700: <code data-color>#4A5568</code> ❌</li>
<li>800: <code data-color>#2D3748</code> ❌</li>
<li>900: <code data-color>#1A202C</code> ❌</li>
</ul>

If you wanted to match these guys you would need to lax your tolerances for blue hues.

```js
const hueToleranceStopsV2 = [
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
```

Which looks like a much different curve:

> ![tailwind hue curve](/assets/gray/hue-curve-tw.svg)

## What is this useful for?

You could use this as a post-processing step to classify things as "gray".

> ![google images](/assets/gray/Screen Capture_select-area_20200525223933.png)

[roots/palette-webpack-plugin](https://github.com/roots/palette-webpack-plugin) uses a simplified
version of this technique to automatically sort colors in a color palette picker.

<hr>

## Further Reading

TODO

[d3-color]: https://github.com/d3/d3-color
[`d3-color`]: https://github.com/d3/d3-color
[d3-hsv]: https://github.com/d3/d3-hsv
[so-hex-rgb]: https://stackoverflow.com/search?q=hex+to+rgb
[valid-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
[bootstrap-colors]: https://github.com/twbs/bootstrap/blob/e94795562b71ecbbe46c9050420f05fd2f602c39/scss/_variables.scss#L9-L17
[colorbrewer 2]: https://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=9
[grayscale]: https://en.wikipedia.org/wiki/Grayscale
[rgb]: https://en.wikipedia.org/wiki/RGB_color_model
[stdev]: https://en.wikipedia.org/wiki/Standard_deviation
[range]: https://en.wikipedia.org/wiki/Range_(statistics)

[lab]: https://en.wikipedia.org/wiki/CIELAB_color_space
[lch]: https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_representation:_CIELCh_or_CIEHLC

[hsv]: https://en.wikipedia.org/wiki/HSL_and_HSV
[curve-fitting]: https://ncss-wpengine.netdna-ssl.com/wp-content/themes/ncss/pdf/Procedures/NCSS/Curve_Fitting-General.pdf
[cie]: https://en.wikipedia.org/wiki/List_of_color_spaces_and_their_uses#CIE


<script src="/assets/gray/2020-05-25-detecting-grayscale-colors.js" type="module"></script>

