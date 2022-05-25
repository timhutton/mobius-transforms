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

int explore_tree(
    const std::array<Mobius, 4>& gens,
    const std::array<std::vector<Complex>, 4>& fp,
    const Mobius& x,
    const int prev,
    const int level,
    const int which_solution,
    const float epsilon2,
    const int max_depth,
    std::array<std::vector<float>, 2>& line_segments)
{
    constexpr float max_d2 = 1.0f;
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
                if( d2 > epsilon2 ) { close_enough = false; }
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
                    line_segments[which_solution].push_back( z[j].real() + 0.1f ); // offset for debugging
                    line_segments[which_solution].push_back( z[j].imag() + 0.05f );
                    line_segments[which_solution].push_back( 0.0f );
                    line_segments[which_solution].push_back( z[j+1].real() + 0.1f );
                    line_segments[which_solution].push_back( z[j+1].imag() + 0.05f );
                    line_segments[which_solution].push_back( 0.0f );
                }
            }
            n_pts += z.size();
        }
        else {
            const int ret = explore_tree( gens, fp, y, iTag, level + 1, which_solution, epsilon2, max_depth, line_segments );
            if( ret == -1) { return -1; } // the abort signal bubbles up the stack
            n_pts += ret;
        }
    }
    return n_pts;
}

int dfs_recursive_tree(
    const std::array<Mobius, 4>& gens,
    const std::array<std::vector<Complex>, 4>& fp,
    const int which_solution,
    const float epsilon2,
    const int max_depth,
    std::array<std::vector<float>, 2>& line_segments)
{
    int n_pts_plotted = 0;
    const int start_order[4] = { 0, 3, 2, 1 }; // default order: aBAb
    for(int iTag : start_order) {
        const int ret = explore_tree( gens, fp, gens[iTag], iTag, 1, which_solution, epsilon2, max_depth, line_segments );
        if( ret == -1 ) {
            return 0; // drawing was aborted
        }
        n_pts_plotted += ret;
    }
    return n_pts_plotted;
}
