---
layout: post
title: "Ubuntu 14 sshfs performance options"
date: 2016-01-23
categories: ubuntu
tags: ubuntu
---

When mounting folders with deeply recursive directories via [sshfs][] you are
definitely punished when using the default options.


{% highlight bash %}
sshfs user@remote:/path/to/remote /path/to/local \
-o Ciphers=arcfour -o Compression=no \
-o ServerAliveInterval=60 -o allow_other
{% endhighlight %}

Todo: benchmarks

More reading:

- [Blazingly fast sshfs - Benjamin's blog - April 24, 2013][smork-post]

[sshfs]: https://github.com/libfuse/sshfs
[smork-post]: http://www.smork.info/blog/2013/04/24/entry130424-163842.html
