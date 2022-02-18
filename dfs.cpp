// Emscripten
#include <emscripten/bind.h>
#include <emscripten/val.h>

// stdlib
#define _USE_MATH_DEFINES
#include <cmath>
#include <vector>


emscripten::val compute(float x, float y) {
    std::vector<float> b;
    for(float theta = 0.0f; theta < 2.0 * M_PI; theta += 0.01f) {
        b.push_back( x + std::cos( theta ) );
        b.push_back( y + std::sin( theta ) );
        b.push_back( 0.0f );
    }
    emscripten::val object = emscripten::val::object();
    object.set( "arr1", emscripten::typed_memory_view( b.size(), b.data() ) );
    object.set( "n", 25 );
    return object;
}

EMSCRIPTEN_BINDINGS( dfs )
{
    emscripten::function("compute", &compute);
}
