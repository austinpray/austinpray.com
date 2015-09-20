---
layout: post 
title: "Travis CI: Node Version Management on Non-Node Projects" 
categories: ops
tags: travis ci node
---

These days you have to go extremely out of your way to avoid using Node tooling
in a web application project. Your application may be written in a language
like Ruby, Python, or PHP, but your front-end probably relies on a variety of
Node packages. Javascript testing, ES6 transpilation, and module loading make
Node a dependency of an otherwise non-Node project. 

So how do you make Travis CI play nice with all these combinations of languages
and tools?

## Travis CI + Node

[Travis supports a variety of languages.][travis-lang] It's pretty easy to
understand how to set up project where Node is the only dependency. The
following setup will run your code under Node 4 and 0.12:

{% highlight yaml %}
language: node_js
node_js:
  - "0.12"
  - "4.0.0"
{% endhighlight %}

## Travis CI + \{\{ Language \}\} + Node

For example, let's say you have a Ruby project that uses Node for your
front-end build process. You will have to do a little bit of manual labor to
test a version of Node other than built-in Travis version:

{% highlight yaml %}
language: ruby
rvm:
  - 2.2.3
  - 1.9.3

env:
  - TRAVIS_NODE_VERSION="0.12"
  - TRAVIS_NODE_VERSION="4"

install:
  - rm -rf ~/.nvm && git clone https://github.com/creationix/nvm.git ~/.nvm && (cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`) && source ~/.nvm/nvm.sh && nvm install $TRAVIS_NODE_VERSION
  - npm install

script:
  - npm test
  - bundle exec rspec
{% endhighlight %}

The above setup creates the following build matrix:

- Ruby 2.2.3 + Node 0.12
- Ruby 2.2.3 + Node 4
- Ruby 1.9.3 + Node 0.12
- Ruby 1.9.3 + Node 4

What is going on in that install script?

{% highlight bash %}
# Define a node version.
TRAVIS_NODE_VERSION="4"

# Clear out whatever version of NVM Travis has.
# Their version of NVM is probably old.
rm -rf ~/.nvm 
# Grab NVM.
git clone https://github.com/creationix/nvm.git ~/.nvm
# Checkout the latest stable tag.
# Note that you can just hardcode a preferred version here.
(cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`)
# Install the desired version of Node
source ~/.nvm/nvm.sh
nvm install $TRAVIS_NODE_VERSION
{%endhighlight %}

## Watch the Math

You have to be a bit careful here. If you define too many versions of Ruby and
Node your build matrix will explode. The number of builds will be the number of
elements in the [cartesian product][] of the versions of your primary language
and your Node version.

R = Ruby Versions  
N = Node Versions  
R × N = { (a, b) | a ∈ R and b ∈ N }

Here is a simple Python program to calculate the combinations if we added
differing versions of NPM to the mix:

{% highlight python %}
{% include sauce/travis-cartesian-1.py %}
{% endhighlight %}

```
This matrix will cause 8 builds
('Ruby 2.2.3', 'Node 0.12', 'NPM 2')
('Ruby 2.2.3', 'Node 0.12', 'NPM 3')
('Ruby 2.2.3', 'Node 4', 'NPM 2')
('Ruby 2.2.3', 'Node 4', 'NPM 3')
('Ruby 1.9.3', 'Node 0.12', 'NPM 2')
('Ruby 1.9.3', 'Node 0.12', 'NPM 3')
('Ruby 1.9.3', 'Node 4', 'NPM 2')
('Ruby 1.9.3', 'Node 4', 'NPM 3')
```

So if for instance we added Node 0.10 to our matrix:

```
This matrix will cause 12 builds
('Ruby 2.2.3', 'Node 0.10', 'NPM 2')
('Ruby 2.2.3', 'Node 0.10', 'NPM 3')
('Ruby 2.2.3', 'Node 0.12', 'NPM 2')
('Ruby 2.2.3', 'Node 0.12', 'NPM 3')
('Ruby 2.2.3', 'Node 4', 'NPM 2')
('Ruby 2.2.3', 'Node 4', 'NPM 3')
('Ruby 1.9.3', 'Node 0.10', 'NPM 2')
('Ruby 1.9.3', 'Node 0.10', 'NPM 3')
('Ruby 1.9.3', 'Node 0.12', 'NPM 2')
('Ruby 1.9.3', 'Node 0.12', 'NPM 3')
('Ruby 1.9.3', 'Node 4', 'NPM 2')
('Ruby 1.9.3', 'Node 4', 'NPM 3')
```

[travis-lang]: http://docs.travis-ci.com/user/languages/
[cartesian product]: http://faculty.etsu.edu/tarnoff/ntes1900/relations.pdf
