importScripts( 'math.js' );

onmessage = function( e ) {
    postMessage( compute() );
}

function compute() {
    const time_start = performance.now();

    var dfs_succeeded = true; // TODO
    var n_pts_plotted = 0;
    var description = 'test';
    var output_pts = [[[]],[]];
    var cloud_pts = [[],[]];
    for(var t = 0.0; t < 3.1; t += 0.1) {
        var p = p2( Math.cos(t), Math.sin(t) );
        output_pts[0][0].push( { p: p, label:'circ' } );
        n_pts_plotted++;
    }

    const time_end = performance.now();
    const ms_elapsed = time_end - time_start;

    return {
        output_pts: output_pts,
        cloud_pts: cloud_pts,
        dfs_succeeded: dfs_succeeded,
        n_pts_plotted: n_pts_plotted,
        description: description,
        ms_elapsed: ms_elapsed
    };
}
