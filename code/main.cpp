/*
    mobius-transforms - Exploring Möbius transformations and implementing the book Indra's Pearls
    Copyright (C) 2022 Tim J. Hutton

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// Local
#include "dfs.h"

// Emscripten
#include <emscripten/bind.h>
#include <emscripten/val.h>

// --------- public API --------------
void set_generator(int i, float a_re, float a_im, float b_re, float b_im, float c_re, float c_im, float d_re, float d_im);
void set_number_of_fixed_points(int iGen, int n);
void set_fixed_point(int iGen, int i, float re, float im);
void set_epsilon(float e);
void set_depth(int d);
emscripten::val compute(int which_solution);
EMSCRIPTEN_BINDINGS( dfs )
{
    emscripten::function("set_generator", &set_generator);
    emscripten::function("set_number_of_fixed_points", &set_number_of_fixed_points);
    emscripten::function("set_fixed_point", &set_fixed_point);
    emscripten::function("set_epsilon", &set_epsilon);
    emscripten::function("set_depth", &set_depth);
    emscripten::function("compute", &compute);
}
// -----------------------------------

// --------- globals --------------
std::array<Mobius, 4> gens;
std::array<std::vector<Complex>, 4> fp;
std::array<std::vector<float>, 2> line_segments;
float epsilon2 = 0.01f * 0.01f;
int max_depth = 25;
// --------------------------------

void set_generator(int i, float a_re, float a_im, float b_re, float b_im,
                  float c_re, float c_im, float d_re, float d_im)
{
    gens[i] << Complex(a_re, a_im), Complex(b_re, b_im), Complex(c_re, c_im), Complex(d_re, d_im);
}

void set_number_of_fixed_points(int iGen, int n)
{
    fp[iGen].resize(n);
}

void set_fixed_point(int iGen, int i, float re, float im)
{
    fp[iGen][i] = Complex(re, im);
}

void set_epsilon(float e) { epsilon2 = e * e; }
void set_depth(int d) { max_depth = d; }

emscripten::val compute(int which_solution)
{
    int num_pts_plotted = 0;
    line_segments[which_solution].clear();
    num_pts_plotted += dfs_recursive_tree(gens, fp, which_solution, epsilon2, max_depth, line_segments);

    emscripten::val object = emscripten::val::object();
    object.set( "line_segments", emscripten::typed_memory_view( line_segments[which_solution].size(), line_segments[which_solution].data() ) );
    return object;
}

