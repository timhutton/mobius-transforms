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
function magnitude( a ) { return Math.sqrt( len2( a ) ); }
function normalize( a ) { return mul( a, 1 / magnitude( a ) ); }
function cross( a, b ) { return p3( a.y * b.z - a.z * b.y, a.z*b.x - a.x * b.z, a.x * b.y - a.y * b.x ); }
function phase( a ) { return Math.atan2( a.y, a.x ); }
function fromPolar( mag, phase ) { return p2( mag * Math.cos(phase), mag*Math.sin(phase) ) }
function sqrt_complex( a ) { return fromPolar( Math.sqrt( magnitude(a) ), phase(a) / 2.0 ); }
function mobius_on_point( m, z ) { return div_complex( add( mul_complex( m[0], z ), m[1] ), add( mul_complex( m[2], z ), m[3] ) ); }
function complex_conjugate( p ) { return p2( p.x, -p.y ); }
function sphereInversion( p, sphere ) {
    var d2 = dist2( p, sphere.p );
    return add( sphere.p, mul( sub( p, sphere.p ), sphere.r * sphere.r / d2 ) );
}

function mobius_normalize( m ) {
    // VCA, p.150
    var sqrt_ad_minus_bc = sqrt_complex( sub( mul_complex( m[0], m[3] ), mul_complex( m[1], m[2] ) ) );
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

function get_mobius_composed(a, b) {
    return [add(mul_complex(a[0], b[0]), mul_complex(a[1], b[2])),
            add(mul_complex(a[0], b[1]), mul_complex(a[1], b[3])),
            add(mul_complex(a[2], b[0]), mul_complex(a[3], b[2])),
            add(mul_complex(a[2], b[1]), mul_complex(a[3], b[3]))];
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

function mobius_on_circle(m, c) {
    // Apply the mobius transformation to a circle. Indra's Pearls, p. 91
    var z = sub( c.p, div_complex( p2(c.r * c.r, 0), complex_conjugate(add(div_complex(m[3], m[2]), c.p))));
    var q = mobius_on_point(m, z);
    var s = dist(q, mobius_on_point(m, add(c.p, p2(c.r, 0))));
    return {p:q, r:s};
}

function pair_circles(a, b) {
    // return the Mobius transformation that pairs these two circles. Indra's Pearls, p.90
    return [ b.p, sub( p2(a.r*b.r, 0), mul_complex(b.p, a.p) ), p2(1.0, 0.0), p2(-a.p.x, -a.p.y) ];
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

