#include "recipes.h"

// Emscripten
#include <emscripten/bind.h>
#include <emscripten/val.h>

// stdlib
#include <iostream>
#include <map>
#include <vector>

// globals
std::vector<float> line_segments;
std::vector<Complex> control_points;
Recipe recipe;

int dfs_recursive_tree(const std::vector<Mobius>& gens, const std::vector<std::vector<Complex>>& repetends);

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
    const std::vector<Mobius> gens = make_generators(recipe, control_points);
    const std::vector<std::vector<Complex>> fp = get_repetends_fixed_points(gens);
    const int num_pts_plotted = dfs_recursive_tree(gens, fp);

    emscripten::val object = emscripten::val::object();
    object.set( "line_segments", emscripten::typed_memory_view( line_segments.size(), line_segments.data() ) );
    object.set( "num_pts_plotted", num_pts_plotted );
    object.set( "n", line_segments.size() );
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

int explore_tree(
    const std::vector<Mobius>& gens,
    const std::vector<std::vector<Complex>>& fp,
    const Mobius& x,
    int prev,
    int level)
{
    constexpr float max_d2 = 1.0f;
    constexpr float closeness_epsilon2 = 0.04f * 0.04f; // TODO: get from UI
    constexpr int max_depth = 25; // TODO: get from UI
    int n_pts = 0;
    for(int k = prev + 1; k >= prev - 1; k--) {
        const int iTag = ( k + 4 ) % 4;
        const Mobius y = x * gens[ iTag ];
        std::vector<Complex> z;
        bool close_enough = true;
        for(size_t i = 0; i < fp[iTag].size(); i++) {
            z.push_back( mobius_on_point( y, fp[iTag][i] ) );
            if( i > 0 ) {
                const float d2 = std::norm( z[i] - z[i-1] );
                if( d2 > closeness_epsilon2 ) { close_enough = false; }
                if( d2 > max_d2 && level >= max_depth ) {
                    // if there are still very long lines at max_depth then we need to abort
                    //std::cout << "Aborting..." << std::endl;
                    return -1;
                }
            }
        }
        if( close_enough || level >= max_depth ) {
            if( close_enough ) {
                // store the line segments
                for(size_t j = 0; j < z.size() - 1; j++) {
                    line_segments.push_back( z[j].real() );
                    line_segments.push_back( z[j].imag() );
                    line_segments.push_back( 0.0f );
                    line_segments.push_back( z[j+1].real() );
                    line_segments.push_back( z[j+1].imag() );
                    line_segments.push_back( 0.0f );
                }
            }
            n_pts += z.size();
        }
        else {
            const int ret = explore_tree( gens, fp, y, iTag, level + 1 );
            if( ret == -1) { return -1; } // the abort signal bubbles up the stack
            n_pts += ret;
        }
    }
    return n_pts;
}

int dfs_recursive_tree(const std::vector<Mobius>& gens, const std::vector<std::vector<Complex>>& fp)
{
    int n_pts_plotted = 0;
    const int start_order[4] = { 0, 3, 2, 1 }; // default order: aBAb
    for(int iTag : start_order) {
        const int ret = explore_tree( gens, fp, gens[iTag], iTag, 1 );
        if( ret == -1 ) {
            return 0; // drawing was aborted
        }
        n_pts_plotted += ret;
    }
    return n_pts_plotted;
}
