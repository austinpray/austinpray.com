---
layout: page
title: Awesome
---

A curated list of awesome tools, frameworks, libraries, and software I have used.

## JavaScript Packages

{% assign jsPackages = site.data.awesome | where:'category', 'js' %}
{% for package in jsPackages %}
### [{{ package.name }}]({{ package.url }})

>
{{ package.quote }}

{{ package.comment }}
{% endfor %}
