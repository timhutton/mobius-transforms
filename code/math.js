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
function mobius( z, a, b, c, d ) { return div_complex( add( mul_complex( a, z ), b ), add( mul_complex( c, z ), d ) ); }
function complex_conjugate( p ) { return p2( p.x, -p.y ); }
function sphereInversion( p, sphere ) {
    var d2 = generalized_dist2( p, sphere.p, sphere.metric_signature );
    return add( sphere.p, mul( sub( p, sphere.p ), sphere.r2 / d2 ) );
}
function generalized_dist2( p1, p2, metric_signature ) {
    // squared-distance function, generalized for different metric signatures
    // e.g. [1,1,0] is the 2D Euclidean plane XY,
    //      [1,-1,0] is the hyperbola model XY,
    //      [1,1,-1] is the hyperboloid model XYZ
    return metric_signature.x * Math.pow( p1.x - p2.x, 2 )
         + metric_signature.y * Math.pow( p1.y - p2.y, 2 )
         + metric_signature.z * Math.pow( p1.z - p2.z, 2 );
}

function mobius_normalize( cp ) {
    // VCA, p.150
    var sqrt_ad_minus_bc = sqrt_complex( sub( mul_complex( cp[0], cp[3] ), mul_complex( cp[1], cp[2] ) ) );
    for( var i = 0; i < 4; i++ )
        cp[i] = div_complex( cp[i], sqrt_ad_minus_bc );
}

function mobius_make_unitary( cp ) {
    cp[2] = mul( complex_conjugate( cp[1] ), -1 );
    cp[3] = complex_conjugate( cp[0] );
}


function get_mobius_inverse( cp ) {
    return [cp[3], mul(cp[1], -1.0), mul(cp[2], -1.0), cp[0]];
}

function get_mobius_composed(a, b) {
    return [add(mul_complex(a[0], b[0]), mul_complex(a[1], b[2])),
            add(mul_complex(a[0], b[1]), mul_complex(a[1], b[3])),
            add(mul_complex(a[2], b[0]), mul_complex(a[3], b[2])),
            add(mul_complex(a[2], b[1]), mul_complex(a[3], b[3]))];
}

function mobius_make_nonloxodromic( cp ) {
    cp[3].y = -cp[0].y;
}

function mobius_identity( cp ) {
    cp[0] = p2( 1, 0 );
    cp[1] = p2( 0, 0 );
    cp[2] = p2( 0, 0 );
    cp[3] = p2( 1, 0 );
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

