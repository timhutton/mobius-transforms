// Emscripten
#include <emscripten/bind.h>
#include <emscripten/val.h>

// stdlib
#define _USE_MATH_DEFINES
#include <cmath>
#include <vector>


emscripten::val compute() {
    std::vector<float> b;
    for(float theta = 0.0f; theta < M_PI; theta += 0.1f) {
        b.push_back( std::cos( theta ) );
        b.push_back( std::sin( theta ) );
        b.push_back( 0.0f );
    }
    return emscripten::val( emscripten::typed_memory_view( b.size(), b.data() ) );
}

EMSCRIPTEN_BINDINGS( dfs )
{
    emscripten::function("compute", &compute);
}
