/*  mobius-transforms - Exploring Möbius transformations and implementing the book Indra's Pearls
    Copyright (C) 2022 Tim J. Hutton

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

function p2( x, y ) { return { x:x, y:y, z:0 }; }
function p3( x, y, z ) { return { x:x, y:y, z:z }; }
function add( a, b ) { return p3( a.x + b.x, a.y + b.y, a.z + b.z ); }
function sub( a, b ) { return p3( a.x - b.x, a.y - b.y, a.z - b.z ); }
function mul( a, f ) { return p3( a.x * f, a.y * f, a.z * f ); }
function average( a, b ) { return mul( add( a, b ), 0.5 ); }
function dot( a, b ) { return a.x * b.x + a.y * b.y + a.z * b.z; }
function len2( a ) { return dot(a,a); }
function dist2( a, b ) { return len2( sub( a, b ) ); }
function dist( a, b ) { return Math.sqrt( len2( sub( a, b ) ) ); }
function mul_complex( a, b ) { return p2( a.x * b.x - a.y * b.y, a.y * b.x + a.x * b.y ); }
function div_complex( a, b ) { return p2( ( a.x * b.x + a.y * b.y ) / len2( b ), ( a.y * b.x - a.x * b.y ) / len2( b ) ); }
function negative( a ) { return p2( -a.x, -a.y ); }
function magnitude( a ) { return Math.sqrt( len2( a ) ); }
function normalize( a ) { return mul( a, 1 / magnitude( a ) ); }
function cross( a, b ) { return p3( a.y * b.z - a.z * b.y, a.z*b.x - a.x * b.z, a.x * b.y - a.y * b.x ); }
function phase( a ) { return Math.atan2( a.y, a.x ); }
function fromPolar( mag, phase ) { return p2( mag * Math.cos(phase), mag*Math.sin(phase) ) }
function sqrt_complex( a ) { return fromPolar( Math.sqrt( magnitude(a) ), phase(a) / 2.0 ); }
function complex_conjugate( p ) { return p2( p.x, -p.y ); }
function sphereInversion( p, sphere ) {
    var d2 = dist2( p, sphere.p );
    return add( sphere.p, mul( sub( p, sphere.p ), sphere.r * sphere.r / d2 ) );
}

function get_mobius_determinant( m ) {
    return sub( mul_complex( m[0], m[3] ), mul_complex( m[1], m[2] ) );
}

function mobius_normalize( m ) {
    // VCA, p.150
    var sqrt_ad_minus_bc = sqrt_complex( get_mobius_determinant( m ) );
    for( var i = 0; i < 4; i++ )
        m[i] = div_complex( m[i], sqrt_ad_minus_bc );
}

function mobius_make_unitary( m ) {
    m[2] = mul( complex_conjugate( m[1] ), -1 );
    m[3] = complex_conjugate( m[0] );
}

function get_mobius_inverse( m ) {
    return [m[3], mul(m[1], -1.0), mul(m[2], -1.0), m[0]];
}

function get_mobius_composed(...args) {
    return args.reduce((a, b) => {
        return [add(mul_complex(a[0], b[0]), mul_complex(a[1], b[2])),
                add(mul_complex(a[0], b[1]), mul_complex(a[1], b[3])),
                add(mul_complex(a[2], b[0]), mul_complex(a[3], b[2])),
                add(mul_complex(a[2], b[1]), mul_complex(a[3], b[3]))];
    });
}

function mobius_make_nonloxodromic( m ) {
    m[3].y = -m[0].y;
}

function mobius_identity( m ) {
    m[0] = p2( 1, 0 );
    m[1] = p2( 0, 0 );
    m[2] = p2( 0, 0 );
    m[3] = p2( 1, 0 );
}

function mobius_on_point( m, z ) {
    if( isNaN(z.x) || isNaN(z.y) ) {
        // special case for z = inf, return a / c
        return div_complex( m[0], m[2] );
    }
    return div_complex( add( mul_complex( m[0], z ), m[1] ), add( mul_complex( m[2], z ), m[3] ) );
}

function mobius_on_circle(m, c) {
    // Apply the mobius transformation to a circle. Indra's Pearls, p. 91
    var z = sub( c.p, div_complex( p2(c.r * c.r, 0), complex_conjugate( add( div_complex( m[3], m[2] ), c.p) ) ) );
    //console.log('z:',z);
    var q = mobius_on_point(m, z);
    //console.log('q:',q);
    //console.log('m(p):',mobius_on_point(m, c.p));
    //console.log('m(p+r):',mobius_on_point(m, add(c.p, p2(c.r, 0.0))));
    var s = dist(q, mobius_on_point(m, add(c.p, p2(c.r, 0.0))));
    //console.log('s:',s);
    return {p:q, r:s};
}

function get_mobius_trace( m ) {
    return add( m[0], m[3] );
}

function get_mobius_fixed_points( T ) {
    // Indra's Pearls, p. 84, p. 78
    // returns [ Fix+, Fix- ] (may be the same)
    var m = [ T[0], T[1], T[2], T[3] ];
    mobius_normalize( m );
    var TrT = get_mobius_trace( m );
    var T2 = get_mobius_composed( m, m );
    var TrT2 = get_mobius_trace( T2 );
    var n = mul( add( TrT, sqrt_complex( sub( TrT2, p2( 4.0, 0.0 ) ) ) ), 0.5 );
    var k = mul_complex( n, n );
    var st2p4 = sqrt_complex( sub( mul_complex( TrT, TrT ), p2( 4.0, 0.0 ) ) );
    var z_plus = div_complex( add( sub( m[0], m[3] ), st2p4 ), mul( m[2], 2.0 ) );
    var z_minus = div_complex( sub( sub( m[0], m[3] ), st2p4 ), mul( m[2], 2.0 ) );
    if( magnitude( k ) > 1.0 ) { return [ z_plus, z_minus ]; }
    else { return [ z_minus, z_plus ]; }
}

function complex_solve_quadratic( a, b, c ) {
    // return both solutions of ax^2 + bx + c = 0
    var sqrt_term = sqrt_complex( sub( mul_complex( b, b ), mul( mul_complex( a, c ), 4.0 ) ) );
    var x1 = div_complex( add( mul( b, -1.0 ), sqrt_term ),  mul( a, 2.0 ) );
    var x2 = div_complex( sub( mul( b, -1.0 ), sqrt_term ),  mul( a, 2.0 ) );
    return [ x1, x2 ];
}

function complex_apply_quadratic( x, a, b, c ) {
    return add( add( mul_complex( a, mul_complex( x, x ) ), mul_complex( b, x ) ), c );
}

function pair_circles(a, b) {
    // return the Mobius transformation that pairs these two circles. Indra's Pearls, p.90
    var P = a.p;
    var r = a.r;
    var Q = b.p;
    var s = b.r;
    // DEBUG:
    //return [ p2(1.0, 0.0), negative(P), p2(0.0, 0.0), p2(1.0, 0.0) ]; // z - P
    //return [ p2(0.0, 0.0), r*s, p2(1.0, 0.0), negative(P) ]; // rs / (z - P)
    return [ Q, sub( p2(r * s, 0), mul_complex(Q, P) ), p2(1.0, 0.0), negative( P ) ]; // rs / (z - P) + Q
}

function pair_circles2(a, b, u, v) {
    // return the Mobius transformation that pairs these two circles. Indra's Pearls, p.90
    var P = a.p;
    var r = a.r;
    var Q = b.p;
    var s = b.r;
    return [ add( mul_complex(p2(s, 0.0), complex_conjugate( v )), mul_complex(Q, u)),
             sub( sub( add( mul(complex_conjugate(u), s*r), mul_complex(Q, mul(v, r)) ), mul( mul_complex(complex_conjugate(v), P), s ) ), mul_complex(mul_complex(Q,u), P) ),
             u,
             sub( mul_complex( p2(r, 0.0), v ), mul_complex(u, P) ) ];
}

function pointInRect( p, rect ) {
    return p.x > rect.x && p.x < ( rect.x + rect.width ) &&
           p.y > rect.y && p.y < ( rect.y + rect.height );
}

function distanceOfPointFromLine( end1, end2, p ) {
    return Math.abs( (end2.y-end1.y)*p.x - (end2.x-end1.x)*p.y + end2.x*end1.y - end2.y*end1.x ) / dist( end1, end2 );
}

function roundTowardsZero( x ) {
    return ( x > 0 ) ? Math.floor(x) : Math.ceil(x);
}

function find_line_segments_intersection( a, b, c, d ) {
    var dx1 = b.x - a.x;
    var dy1 = b.y - a.y;
    var dx2 = d.x - c.x;
    var dy2 = d.y - c.y;
    var dx3 = a.x - c.x;
    var dy3 = a.y - c.y;
    var d = dx1 * dy2 - dx2 * dy1;
    if(d !== 0) {
        var s = dx1 * dy3 - dx3 * dy1;
        if((s <= 0 && d < 0 && s >= d) || (s >= 0 && d > 0 && s <= d)) {
            var t = dx2 * dy3 - dx3 * dy2;
            if((t <= 0 && d < 0 && t > d) || (t >= 0 && d > 0 && t < d)) {
                t = t / d;
                return [true, p2( a.x + t * dx1, a.y + t * dy1 ) ];
            }
        }
    }
    return [false, undefined];
}