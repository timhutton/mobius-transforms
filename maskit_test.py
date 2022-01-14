""" Code for Iterated Function System using Mobius transformations.

Uses the Maskit parameterization, as described in http://www.josleys.com/articles/Kleinian%20escape-time_3.pdf
"""

import matplotlib.pyplot as plt
import numpy as np
import random

datatype = np.csingle # works fine with either single or double precision

t = 2
#t = 1.95+0.02j
maskit = np.array([ [ t, -1j, -1j, 0 ], [1, 2, 0, 1 ], [ 0, 1j, 1j, t ], [ 1, -2, 0, 1 ] ], dtype=datatype)

def mobius( z, a, b, c, d ):
    return ( a * z + b ) / ( c * z + d )

def ifs( z, generator ):
    return mobius( z, *random.choice(generator) )

fig = plt.figure()
ax = fig.add_subplot(111)

n = 1000
m = 100

# approach 1: start with a single point, iterate many times and collect the values
# (looks good but this approach won't work well on a GPU)
p = datatype(0.01+0.01j)
num_pts = n * m
pts = np.empty( (num_pts), dtype=datatype )
for i in range(num_pts):
    p = ifs( p, maskit )
    pts[i] = p

# approach 2: start with points from a region, iterate a few times
# (works well on a GPU but has ghosting effects on systems with sharp limit sets like Maskit)
pts2 = []
ps = np.random.uniform(low=-5, high=5, size=(n)) + 1j * np.random.uniform(low=-5, high=5, size=(n))
for it in range(m):
    for i, p in enumerate(ps):
        ps[i] = ifs( p, maskit )
        pts2.append( ps[i] )

# approach 3: as approach 2 but run for k iterations before accumulating
# (best of both worlds?)
k = 20
pts3 = []
ps = np.random.uniform(low=-5, high=5, size=(n)) + 1j * np.random.uniform(low=-5, high=5, size=(n))
for it in range(m + k):
    for i, p in enumerate(ps):
        ps[i] = ifs( p, maskit )
        if it > k:
            pts3.append( ps[i] )

ax.scatter(pts.real, pts.imag, s=0.1, c='g') # approach 1: green (looks almost the same as approach 3)
ax.scatter([p.real for p in pts2], [p.imag for p in pts2], s=0.1, c='r') # approach 2: red
ax.scatter([p.real for p in pts3], [p.imag for p in pts3], s=0.1, c='b') # approach 3: blue

plt.xlim(-2.4, 2.4)
plt.ylim(-1, 3)
plt.show()
