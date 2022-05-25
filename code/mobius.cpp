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

Complex mobius_on_point(const Mobius& m, const Complex& z)
{
    if( !isfinite(z.real()) ) {
        // special case for z = inf, return a / c
        return m(0,0) / m(1,1);
    }
    return ( m(0,0)*z + m(0,1) ) / ( m(1,0)*z + m(1,1) );
}

Mobius get_mobius_normalized(const Mobius& m)
{
    return m / std::sqrt( m.determinant() );
}

std::array<Complex, 2> get_mobius_fixed_points(const Mobius& m)
{
    // Indra's Pearls, p. 84, p. 78
    // returns [ Fix+, Fix- ] (may be the same)
    const Mobius mn = get_mobius_normalized( m );
    const Complex TrT = mn.trace();
    const Complex TrT2 = (mn * mn).trace();
    const Complex n = (TrT + std::sqrt( TrT2 - 4.0f )) / 2.0f;
    const Complex k = n * n;
    const Complex st2p4 = std::sqrt( (TrT * TrT) - 4.0f );
    const Complex z_plus = ( mn(0,0) - mn(1,1) + st2p4 ) / (mn(1,0) * 2.0f);
    const Complex z_minus = ( mn(0,0) - mn(1,1) - st2p4 ) / (mn(1,0) * 2.0f);
    if( std::abs( k ) > 1.0f ) { return { z_plus, z_minus }; }
    else { return { z_minus, z_plus }; }
}

std::array<Complex, 2> complex_solve_quadratic(const Complex& a, const Complex& b, const Complex& c)
{
    // return both solutions of ax^2 + bx + c = 0
    const Complex sqrt_term = sqrt( b * b - 4.0f * a * c );
    const Complex x1 = ( -b + sqrt_term ) / ( 2.0f * a );
    const Complex x2 = ( -b - sqrt_term ) / ( 2.0f * a );
    return { x1, x2 };
}
