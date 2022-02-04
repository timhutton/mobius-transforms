importScripts( 'math.js' );
importScripts( 'recipes.js' );
importScripts( 'GrowableTypedArray.js' );

var recipes = get_recipes();

onmessage = function( e ) {
    var params = e.data;
    compute( params );
}

function compute( params ) {
    var recipe = recipes[ params.iRecipe ];
    var dfs_succeeded = true; // TODO
    var n_pts_plotted = 0;
    var description = '';
    var vertices = new GrowableTypedArray( n => new Float32Array( n ) );
    var cloud_pts = [[], []];
    for( var iWhichSolution = 0; iWhichSolution < params.solutions_to_plot.length; iWhichSolution++ ) {
        var which_solution = params.solutions_to_plot[ iWhichSolution ];
        var [transforms, desc] = make_generators( recipe, which_solution, params.control_points );
        var [gens, repetends] = get_repetends( transforms );
        n_pts_plotted += dfs_recursive_tree( recipe, gens, repetends, params.max_depth, params.closeness_epsilon, which_solution, vertices );
        description = desc;
    }
    const vertices_buffer = vertices.array.buffer;

    postMessage(
        {
            cloud_pts: cloud_pts,
            dfs_succeeded: dfs_succeeded,
            n_pts_plotted: n_pts_plotted,
            description: description,
            vertices_buffer: vertices_buffer
        },
        [vertices_buffer]);
}

function make_generators( recipe, which_solution, control_points ) {
    // construct the four Mobius transformations we will be using
    var [transforms, description] = recipe.make_generators( which_solution, control_points );
    transforms[2] = get_mobius_inverse( transforms[0] );
    transforms[3] = get_mobius_inverse( transforms[1] );
    return [transforms, description];
}

function get_repetends( transforms ) {
    var [ a, b, A, B ] = transforms;
    var gens = [ {t:a, name:'a'}, {t:b, name:'b'}, {t:A, name:'A'}, {t:B, name:'B'} ];
    var bABa = get_mobius_composed(b, A, B, a);
    var BAba = get_mobius_composed(B, A, b, a);
    var ABab = get_mobius_composed(A, B, a, b);
    var aBAb = get_mobius_composed(a, B, A, b);
    var BabA = get_mobius_composed(B, a, b, A);
    var baBA = get_mobius_composed(b, a, B, A);
    var abAB = get_mobius_composed(a, b, A, B);
    var AbaB = get_mobius_composed(A, b, a, B);
    var aaB = get_mobius_composed(a, a, B);
    var aBa = get_mobius_composed(a, B, a);
    var Baa = get_mobius_composed(B, a, a);
    var AAb = get_mobius_composed(A, A, b);
    var AbA = get_mobius_composed(A, b, A);
    var bAA = get_mobius_composed(b, A, A);
    var repetends = [ [ // each in alphabetical order per abAB with the next letter from [1,0,-1] mod 4, ie:
                        //  after a we get: b,a,B
                        //  after B we get: a,B,A
                        //  after A we get: B,A,b
                        //  after b we get: A,b,a
            { p: get_mobius_fixed_points( bABa )[0], label: '|bABa' },
            { p: get_mobius_fixed_points( a )[0],    label: '|a' },
            //{ p: get_mobius_fixed_points( aBa )[0],  label: '|aBa' },
            //{ p: get_mobius_fixed_points( Baa )[0],  label: '|Baa' },
            { p: get_mobius_fixed_points( BAba )[0], label: '|BAba' },
        ], [
            { p: get_mobius_fixed_points( ABab )[0], label: '|ABab' },
            { p: get_mobius_fixed_points( b )[0],    label: '|b' },
            //{ p: get_mobius_fixed_points( AAb )[0],  label: '|AAb' },
            { p: get_mobius_fixed_points( aBAb )[0], label: '|aBAb' },
        ], [
            { p: get_mobius_fixed_points( BabA )[0], label: '|BabA' },
            { p: get_mobius_fixed_points( A )[0],    label: '|A' },
            //{ p: get_mobius_fixed_points( AbA )[0],  label: '|AbA' },
            //{ p: get_mobius_fixed_points( bAA )[0],  label: '|bAA' },
            { p: get_mobius_fixed_points( baBA )[0], label: '|baBA' },
        ], [
            { p: get_mobius_fixed_points( abAB )[0], label: '|abAB' },
            { p: get_mobius_fixed_points( B )[0],    label: '|B' },
            //{ p: get_mobius_fixed_points( aaB )[0],  label: '|aaB' },
            { p: get_mobius_fixed_points( AbaB )[0], label: '|AbaB' },
        ]
    ];
    return [gens, repetends];
}

function dfs_recursive_tree(recipe, gens, repetends, max_depth, closeness_epsilon, which_solution, vertices) {
    var max_d2 = 1.0;
    var closeness_epsilon2 = closeness_epsilon * closeness_epsilon;
    function explore_tree( x, old_word, prev, level ) {
        var n_pts = 0;
        for( var k = prev + 1; k >= prev - 1; k--) {
            var iTag = mod4( k );
            var y = get_mobius_composed( x, gens[ iTag ].t );
            var z = [];
            var close_enough = true;
            for(var i = 0; i < repetends[iTag].length; i++) {
                z.push( {
                    p: mobius_on_point( y, repetends[iTag][i].p ),
                    // label: old_word + repetends[iTag][i].label
                    } );
                if( i > 0 ) {
                    var d2 = dist2( z[i].p, z[i-1].p );
                    if( d2 > closeness_epsilon2 ) { close_enough = false; }
                    if( d2 > max_d2 && level >= max_depth ) {
                        // if there are still very long lines at max_depth then we need to abort
                        return -1; // debug: no abort
                    }
                }
            }
            if( close_enough ) {
                // draw the line segments
                for(var i = 0; i < z.length; i++) {
                    const ix = vertices.add( z[i].p.x );
                    const iy = vertices.add( z[i].p.y );
                    // TODO: store the indices
                }
                //output_pts[which_solution].push( z );
                n_pts += z.length;
            }
            else if( level >= max_depth ) {
                // we've reached the maximum search depth and the lines are still too long - don't draw anything
            }
            else {
                var new_word = old_word + gens[ iTag ].name;
                var ret = explore_tree( y, new_word, iTag, level + 1 );
                if( ret == -1) { return -1; } // the abort signal bubbles up the stack
                n_pts += ret;
            }
        }
        return n_pts;
    };
    var n_pts_plotted = 0;
    var start_letters = [0, 3, 2, 1]; // default order: aBAb
    if( 'start_letters' in recipe ) { start_letters = recipe.start_letters; }
    for( var iStartLetter = 0; iStartLetter < start_letters.length; iStartLetter++) {
        var iTag = start_letters[iStartLetter];
        var ret = explore_tree( gens[iTag].t, gens[iTag].name, iTag, 1 );
        if( ret == -1 ) {
            return 0; // drawing was aborted
        }
        n_pts_plotted += ret;
    }
    return n_pts_plotted;
}

function mod4( x ) {
    while( x < 0 ) { x += 4; }
    return x % 4;
}
