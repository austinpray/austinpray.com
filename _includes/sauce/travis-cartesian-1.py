#!/usr/bin/env python
import itertools
from string import Template
product = list(itertools.product(
  ["Ruby 2.2.3", "Ruby 1.9.3"],
  ["Node 0.12", "Node 4"],
  ["NPM 2", "NPM 3"]
))

combinations = len(product)

print Template("This matrix will cause $c builds").substitute(c=combinations)

for el in product: print el
