#include "recipes.h"

// Emscripten
#include <emscripten/bind.h>
#include <emscripten/val.h>

// stdlib
#include <map>
#include <vector>

std::vector<float> line_segments;
std::vector<Complex> control_points;
Recipe recipe;

void set_number_of_control_points(int n)
{
    control_points.resize(n);
}

void set_control_point(int i, float re, float im)
{
    control_points[i] = { re, im };
}

void set_recipe(Recipe r)
{
    recipe = r;
}

emscripten::val compute()
{
    const std::vector<Mobius> transforms = get_transforms(recipe, control_points);
    const float x = control_points[0].real();
    const float y = control_points[0].imag();
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
    emscripten::enum_<Recipe>("Recipe")
        .value("grandma", Recipe::grandma)
        .value("maskit", Recipe::maskit);
    emscripten::function("set_number_of_control_points", &set_number_of_control_points);
    emscripten::function("set_control_point", &set_control_point);
    emscripten::function("set_recipe", &set_recipe);
    emscripten::function("compute", &compute);
}
