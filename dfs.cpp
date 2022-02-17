// Emscripten
#include <emscripten/bind.h>
#include <emscripten/val.h>

// stdlib
#include <vector>

emscripten::val compute() {
    std::vector<float> b;
    b.push_back( 43.5f );
    b.push_back( 113.01f );
    return emscripten::val( emscripten::typed_memory_view( b.size(), &b.front() ) );
}

EMSCRIPTEN_BINDINGS( dfs )
{
    emscripten::function("compute", &compute);
}
