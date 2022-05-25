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

// Eigen
#include <Eigen/Dense>

// stdlib
#define _USE_MATH_DEFINES
#include <cmath>
#include <complex>

using Mobius = Eigen::Matrix2cd;
using FloatType = double;
using Complex = std::complex<FloatType>;

Complex mobius_on_point(const Mobius& m, const Complex& z);

Mobius get_mobius_normalized(const Mobius& m);

std::array<Complex, 2> get_mobius_fixed_points(const Mobius& m);

std::array<Complex, 2> complex_solve_quadratic(const Complex& a, const Complex& b, const Complex& c);
