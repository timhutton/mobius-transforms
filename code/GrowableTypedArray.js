class GrowableTypedArray {
    // block_func: a function that creates a new TypedArray of the requested size
    // inc: the size by which to increment the internal storage as more elements are stored
    // Example:
    //   var arr = new GrowableTypedArray( n => new Float32Array( n ) );
    //   arr.add( 3.14 );
    //   const float32arr = arr.array();
    constructor( block_func, inc=1024 ) {
        this.block_func = block_func;
        this.inc = inc;
        this.blocks = [];
        this.n = 0;
    }
    get array() {
        if( this.blocks.length == 0 ) {
            throw "Empty array";
        }
        var arr = this.block_func( this.n );
        // copy over the full blocks
        var k = 0;
        for(var i = 0; i < this.blocks.length - 1; i++) {
            arr.set( this.blocks[ i ], k );
            k += this.inc;
        }
        // copy over as much of the last block as has been used
        arr.set( this.blocks[ this.blocks.length - 1 ].subarray( 0, this.n - k ), k );
        return arr;
    }
    add( val ) {
        const i = this.n % this.inc;
        // create a new block if needed
        if( i == 0 ) {
            this.blocks.push( this.block_func( this.inc ) );
        }
        // write into the last block
        this.blocks[ this.blocks.length - 1 ][ i ] = val;
        this.n++;
        // return the index of the added item
        return this.n - 1;
    }
}
