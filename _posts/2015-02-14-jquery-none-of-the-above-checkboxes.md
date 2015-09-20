---
layout: post 
title: "“None of the Above” Checkbox with jQuery" 
categories: javascript
tags: jquery forms
math: true
---

## Demo

<p 
  data-height="300" 
  data-theme-id="12308" 
  data-slug-hash="KwQQbE" 
  data-default-tab="result" 
  data-user="austinpray" 
  class='codepen'>See the Pen <a
  href='http://codepen.io/austinpray/pen/KwQQbE/'>Smart Checkboxes</a> by Austin
  Pray (<a href='http://codepen.io/austinpray'>@austinpray</a>) on <a
  href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Source

- [CodePen](http://codepen.io/austinpray/pen/KwQQbE/)
- [Gist](https://gist.github.com/austinpray/0f5d6c5179e855892b46)

## Problem

I had a friend last night ask me:

>Anyone good at jQuery want to tell me if the following is a convoluted?
{% highlight js %}
$('.gfield_checkbox input[value="none"]').change(function() {
  $(this).parents('.gfield_checkbox').find('input:checkbox').not(this).prop('checked', false).prop('disabled', $(this)[0].checked);
});
{% endhighlight %}

He had a group of checkboxes:

- option 1
- option 2
- option 3
- none of the above


He wanted them to behave such that:

1. When "none of the above" is checked: all the other options become unchecked and disabled.
2. When "none of the above" is unchecked: all the other options become enabled again.

There is nothing really wrong with the jquery one-liner my friend came up with. However I wanted a solution that didn't rely on the user having to uncheck "none of the above" before being able to click another option. So:

1. When "none of the above" is checked: all of the other options become unchecked.
2. When an option other than "none of the above" is selected and "none of the above" is already checked: "none of the above" should be automatically unchecked.

## Over-engineered Solution

![gif of checkboxes](/assets/checkbox.gif)

### Approach

Each time a checkbox in the group is checked:

1. Loop through all of the checked boxes and get their values.
2. If "none of the above" is among the values: decide which ones to uncheck based on the element that was just clicked.

### Deciding when to uncheck 

We loop through all of the checked boxes. For each element in the loop we evaluate this statement to determine if we should uncheck it:

$$
A = \text{User checked "none of the above"}\\
B = \text{Current element in the loop is "none of the above"}\\
A \oplus B \equiv (A \rightarrow B) \rightarrow (\neg(B \rightarrow A))
$$

or:

{% highlight javascript %}
if (A^B) {
  // uncheck everything else
}
{% endhighlight %}

If you are unfamiliar with logical operators: [XOR](https://en.wikipedia.org/wiki/Exclusive_or). I highly recommend getting familiar with all your logical operators. In this case an exclusive OR saves us from:

$$
A = \text{User checked "none of the above"}\\
B = \text{Current element in the loop is "none of the above"}\\
(\neg A \wedge B) \vee (A \wedge \neg B)
$$

or this confusing mess:

{% highlight javascript %}
if ((!A && B) || (A && !B)) {
  // uncheck everything else
}
{% endhighlight %}

## Conclusions

This probably is/should be a jQuery plugin.
