---
layout: post 
title: "How to count bits and influence people"
date: 2016-09-20
tags: swar
author: Tom Coladonato
---

This is a SIMD within a register (SWAR) bit count algorhythm.

```
//From http://aggregate.org/MAGIC/
unsigned int
ones32(register unsigned int x)
{
        /* 32-bit recursive reduction using SWAR...
	   but first step is mapping 2-bit values
	   into sum of 2 1-bit values in sneaky way
	*/
        x -= ((x >> 1) & 0x55555555); //Step 1
        x = (((x >> 2) & 0x33333333) + (x & 0x33333333)); //Step 2
        x = (((x >> 4) + x) & 0x0f0f0f0f); //Step 3
        x += (x >> 8); //Step 4
        x += (x >> 16); //Step 5
        return(x & 0x0000003f);//Step 6
}
```

## How does this work?

Imagine your number as 32 1 bit numbers
(i.e. 0101010101010101010101010101)

### STEP 1

```
x -= ((x >> 1) & 0x55555555); 
```

Then imagine adding each pair of 1 bit numbers together into their own sum as a two bit number in place.
(i.e. 00 => 00, 01 => 01, 10 => 01, 11 => 10)

This means that the only changes needed to be made are 10 => 01 and 11 => 10.

The first bit is true only if both bits are true and the second bit is true only if exactly one of the bits is true.

this means that for a 2 bit number x where

```
==========
x = 11
x                 = 1 1
x >> 1            = 0 1
0x5         = (0 1) 0 1
(x>>1)&0x5        = 0 1
x - ((x>>1) & 0x5 = 1 0 = 2

==========
x = 10
x                 = 1 0
x >> 1            = 0 1
0x5         = (0 1) 0 1
(x>>1)&0x5        = 0 1
x - ((x>>1) & 0x5 = 0 1 = 1

for x = 01
x                 = 0 1
x >> 1            = 0 0
0x5         = (0 1) 0 0
(x>>1)&0x5        = 0 0
x - ((x>>1) & 0x5 = 0 1 = 1

for x = 00
x                 = 0 0
x >> 1            = 0 0
0x5         = (0 1) 0 0
(x>>1)&0x5        = 0 0
x - ((x>>1) & 0x5 = 0 0 = 0
```

since these operations cannot over or underflow their own bits
for any 32 bit number x these operations will convert each pair of bits into their own 2 bit sum.

Interestingly this is the only step that is actually concerned with the bit count, the rest of the steps are only recursively summing larger and larger bitsegments.

### STEP 2

```
x = (((x >> 2) & 0x33333333) + (x & 0x33333333));
```

Once each pair of bits is converted into their own sum consider every group of 4 sequential bits each representing two 2bit numbers.
```
0000
0001
0010
0100
0101
0110
1000
1001
1010
```

*Each pair of bits can only be 00 01 or 10 at this point

We can add these together by shifting each "left" pair of bits and adding it to its "right" pair of bits
for a 4 bit number x where

```
=====
x                            = 1 0 1 0 // 2 and 2
x >> 2                       = 0 0 1 0
0x3                          = 0 0 1 1
(x >> 2) & 0x3               = 0 0 1 0
x & 0x3                      = 0 0 1 0
((x >> 2) & 0x3) + (x & 0x3) = 0 1 0 0 // 4

=====
x                            = 0 1 1 0 // 1 and 2
x >> 2                       = 0 0 0 1
0x3                          = 0 0 1 1
(x >> 2) & 0x3               = 0 0 0 1
x & 0x3                      = 0 0 1 0
((x >> 2) & 0x3) + (x & 0x3) = 0 0 1 1 // 3

=====
x                            = 0 0 1 0 // 0 and 2
x >> 2                       = 0 0 0 0
0x3                          = 0 0 1 1
(x >> 2) & 0x3               = 0 0 0 0
x & 0x3                      = 0 0 1 0
((x >> 2) & 0x3) + (x & 0x3) = 0 0 1 0 // 2
```

### STEP 3

```
x = (((x >> 4) + x) & 0x0f0f0f0f);
```

Now in our 32 bit register every 4 bit segment is a 4 bit representation of the count of its original 4 bits.
So the next step is to add a pair of 4 bit numbers into an 8 bit representation of their sum.

```
00000000
...
01000100 (each 4 bit sum can't be larger than 4)
```

with 8 bit number x where

```
=====
x                       = 01000100 // 4 and 4
x >> 4                  = 00000100
(x >> 4) + x            = 01001000
0x0f                    = 00001111
(((x >> 4) + x) & 0x0f) = 00001000 // 8

=====
x                       = 00110100 // 3 and 4
x >> 4                  = 00000011
(x >> 4) + x            = 00110111
0x0f                    = 00001111
(((x >> 4) + x) & 0x0f) = 00000111 // 7

=====
x                       = 00010000 // 1 and 0
x >> 4                  = 00000001
(x >> 4) + x            = 00010001
0x0f                    = 00001111
(((x >> 4) + x) & 0x0f) = 00000001 // 1

STEP 4
====================
x += (x >> 8);
```

Now in our 32 bit register every 8 bit segment is an 8 bit representation of the count of its original 8 bits.
So the next step is to sum pairs of 8 bit numbers into 16 bit sums.

```
0000000000000000
...
0000100000001000 (each 8 bit number can't be larger than 8)
```

with 16 bit number x where

```
=====
x            = 0000100000001000 // 8 and 8
x >> 8       = 0000000000001000
x + (x >> 8) = 0000100000010000 // 8 and 16 ???
```

What is going on here? there are garbage bits in the output!

The secret to steps 4 and 5 is that even though they emit garbage bits,
the final sum is bitmasked by 0x3f(0b111111) which truncates all the garbage bits and caps the sum to 32!
This is because the sum of 8 bits is small enough to guarantee enough space that dirty adding will not overflow garbage bits into the real bits.

This can be seen more easily by examining the entire register (R) in abstract.

```
                 0123456789ABCDEFGHIJKLMNOPQRSTUV
 R             = 0000aaaa0000aaaa0000aaaa0000aaaa //Imagine a encodes a possible 1 with each 8 bits maximally being 8 (a000)
 R >> 8        = 000000000000aaaa0000aaaa0000aaaa
 R + (R >> 8)  = 0000aaaa000aaaaa000aaaaa000aaaaa // Since there were 3 known 0 bits per 8 bit, an overflow into the 6th bit is fine.
                 [--------GARBAGE-------]00[ sum]
```

### STEP 5

```
                 0123456789ABCDEFGHIJKLMNOPQRSTUV
 R             = 0000aaaa000aaaaa000aaaaa000aaaaa
 R >> 16       = 00000000000000000000aaaa000aaaaa
 R + (R >> 16) = 0000aaaa000aaaaa000aaaaa00aaaaaa // the last 8 bits encode the actual 32 bit sum, the rest is garbage.
                 [--------GARBAGE-------]0[-sum-]
					
Finally
                 0123456789ABCDEFGHIJKLMNOPQRSTUV
             R = 0000aaaa000aaaaa000aaaaa00aaaaaa
    0x0000003f = 00000000000000000000000000111111
R & 0x0000003f = 00000000000000000000000000aaaaaa // 6 possible 1s with the largest actual possible being 32 (100000)
```
