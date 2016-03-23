---
layout: post 
title: "Probability and Statistics for Computer Scientists" 
date: 2016-01-19
categories: math
tags: cs math
math: true
---

Running list of some useful Probability and Statistics Stuff. Unless otherwise
noted most of this material is grifted from *Probability and Statistics for
Computer Scientists*, M. Baron, Chapman & Hall/CRC Press
(2014), Second Edition ISBN 9781439875902.

Code examples are probably using python 2.7ish unless otherwise noted. Python
examples probably require scipy.

## Rules of Probability

let $$P(x)$$ be a function that represents probability of an event $$x$$. Assume sample space $$\Omega$$ and a sigma-algebra of events $$\mathfrak{M}$$ on it.

$$
P : \mathfrak{M} \implies [0, 1]
$$

$$P(A) = 1$$ means the event is 100% likely.

### Probability of an intersection

let $$\{E\}$$ be a set of independent events:

$$
P(E_1 \cap ... \cap E_n) = P(E_1) \cdot ... \cdot P(E_n)
$$

Ya just multiply 'em.

### Probability of a Union

let $$A$$ and $$B$$ be mutually exclusive events.

$$
P(A \cup B) = P(A) + P(B)
$$

let $$A$$ and $$B$$ be independent events:

$$
P(A \cup B) = P(A) + P(B) - P(A \cap B)
$$

let $$A$$ and $$B$$ and $$C$$ be independent events:

$$
P(A \cup B \cup C) = P(A) + P(B) + P(C) -
P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)
$$

The strategy for 3 independent events blows up a bit due to the fact that when
you add $$P(A) + P(B) + P(C)$$ you count each pairwise intersection twice. So
you have to subtract each intersection's probablity. $$P(A \cap B \cap C)$$ is
completely negated so you have to add it at the end.

## More to come
**To be continued...**
