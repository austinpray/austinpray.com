---
layout: post 
title: "Make Slackbot Respond to Regex" 
categories: hacks
tags: slack slackbot perl
---

I love [Slack][] and [Slackbot][]. As far as [Slackbot][] goes: I mostly use it to inject a bit of humor into the chat via the automatic responses feature.

![Ridwan getting upset](/assets/slackbotridupset.png)

## Basic Usage

There are a couple tricks you need to know about to get the most out of the
automatic responses:

>
- Separate multiple input phrases with commas. For example: **hi, hello, yo**
- You can add as many Slackbot responses as you'd like for each input phrase. Put each one on its own line. (A random response will be chosen if there are multiple responses.) For example:
  **Well hi there!  
  Hello yourself  
  Yo yo yo**

With all of these tricks in mind you can do things like I ask slackbot to make
decisions:

![flip coin](/assets/slackbotflipcoin.png)

## Regex Input Phrases

This is all well and good, but it is not very flexible. For instance if you
wanted Slackbot to respond to “yee”, ”yeeeeeeeee”, and everyting inbetween you
would use a regex such as `/yee{1,8}/`. Since slackbot doesn't read regex, you
have to statically compile the regex permutations and then feed them to
Slackbot. I went ahead and used the [Genex][] perl module to do this. I explain
how to install perl modules further down.

### example: “yee”

```
perl -MRegexp::Genex=:all -le 'print join(",\n", strings(qr/yee{1,8}/, 20))'
```

Will yield the following:

```
yeeeeeeeee,
yeeeeeeee,
yeeeeeee,
yeeeeee,
yeeeee,
yeeee,
yeee,
yee
```

Note the `strings` method:

```
@list = strings( $regex, [ $max_length = 10 ] )
  Produce a list of strings that would match the regex.
```

### example: “how good is x at y?”

They can get pretty complex:

```
perl -MRegexp::Genex=:all -le 'print join(",\n", strings(qr/How good is (Ridwan|Austin|Darren) at (perl|python|golang)\?/, 30))'
```

Will yield:

```
How good is Ridwan at perl?,
How good is Ridwan at python?,
How good is Ridwan at golang?,
How good is Austin at perl?,
How good is Austin at python?,
How good is Austin at golang?,
How good is Darren at perl?,
How good is Darren at python?,
How good is Darren at golang?
```

### example “aww yiss”

```
perl -MRegexp::Genex=:all -le 'print join(",\n", strings(qr/aww{1,9} yiss{1,9}/, 50))'
```

[Will yeild this.](https://gist.github.com/7a04e52b8c08973d4c7e) So basically
anyone can type [awww yisss](http://www.harkavagrant.com/index.php?id=125) with
an arbitrary combination of w's or s's and still get the desired automatic
slackbot response.

## How to Install Perl Modules

If you've never used perl before, you should check out
[CPAN](http://www.cpan.org/modules/index.html) and [their install
instructions](http://www.cpan.org/modules/INSTALL.html). 

If you are on Mac OSX you already have `perl` and `cpan` in your path. So all
you need to do is install `cpanm`.

```
cpan App::cpanminus
```

Which will give you a `cpanm` executable at `~/perl5/bin/cpanm`. Now install the
[Genex][] module:

```
~/perl5/bin/cpanm Regexp::Genex
```

If that succeeded you can now play around with [Genex][] and impress your
friends.

[Slack]: https://slack.com/
[Slackbot]: https://slack.zendesk.com/hc/en-us/articles/202026038-Slackbot-your-setup-assistant-personal-notepad-and-programmable-bot
[Genex]: http://search.cpan.org/~bowmanbs/Regexp-Genex-0.07/lib/Regexp/Genex.pm
