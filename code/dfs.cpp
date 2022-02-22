#include "mobius.h"

// Emscripten
#include <emscripten/bind.h>
#include <emscripten/val.h>

// stdlib
#include <vector>

std::vector<float> line_segments;

emscripten::val compute(float x, float y) {

    // placeholder: output line segments for a circle
    line_segments.clear();
    for(float theta = 0.0f; theta < 2.0 * M_PI; theta += 0.01f) {
        line_segments.push_back( x + std::cos( theta ) );
        line_segments.push_back( y + std::sin( theta ) );
        line_segments.push_back( 0.0f );
    }
    emscripten::val object = emscripten::val::object();
    object.set( "line_segments", emscripten::typed_memory_view( line_segments.size(), line_segments.data() ) );
    return object;
}

EMSCRIPTEN_BINDINGS( dfs )
{
    emscripten::function("compute", &compute);
}
