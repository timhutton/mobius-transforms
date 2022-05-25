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
#include "mobius.h"

// stdlib
#include <vector>

int dfs_recursive_tree(
    const std::array<Mobius, 4>& gens,
    const std::array<std::vector<Complex>, 4>& fp,
    const int which_solution,
    const float epsilon2,
    const int max_depth,
    std::array<std::vector<float>, 2>& line_segments);
