#include "mobius.h"

// stdlib
#include <vector>
using namespace std::literals;

enum class Recipe { gasket, grandma };

std::vector<Mobius> make_generators(const Recipe recipe, const std::vector<Complex>& control_points, int which_solution)
{
    std::vector<Mobius> transforms(4);

    switch(recipe)
    {
        case Recipe::gasket:
            transforms[0] << 1.0f, 0.0f, 0.0f - 2.0if, 1.0f;
            transforms[1] << 1.0f - 1.0if, 1.0f, 1.0f, 1.0f + 1.0if;
            break;
        case Recipe::grandma:
            // Indra's Pearls, p. 227
            const Complex t_a = control_points[0];
            const Complex t_b = control_points[1];
            // solve x^2 - t_a * t_b * x + t_a^2 + t_b^2 = 0 for x
            const std::array<Complex, 2> solutions = complex_solve_quadratic( 1.0f, -t_a * t_b, t_a * t_a + t_b * t_b);
            const Complex t_ab = solutions[which_solution]; // pick one
            const Complex z0 = ( t_ab - 2.0f ) * t_b / ( t_b * t_ab - 2.0f * t_a + 2.0if * t_ab );
            transforms[0] << 0.5f * t_a,
                          ( t_a * t_ab - 2.0f * t_b + 4.0if ) / ( z0 * ( 2.0f * t_ab + 4.0f) ),
                          z0 * ( t_a * t_ab - 2.0f * t_b - 4.0if ) / ( 2.0f * t_ab - 4.0f ),
                          0.5f * t_a;
            transforms[1] << 0.5f * ( t_b - 2.0if ),
                          0.5f * t_b,
                          0.5f * t_b,
                          0.5f * ( t_b + 2.0if );
            break;
    }

    transforms[2] = transforms[0].inverse();
    transforms[3] = transforms[1].inverse();
    return transforms;
}

std::vector<std::vector<Complex>> get_repetends_fixed_points(const std::vector<Mobius>& gens)
{
    if(gens.size() != 4) { throw std::runtime_error("get_repetends_fixed_points assumes 4 generators"); }

    std::vector<std::vector<Complex>> fp(4);
    const Mobius& a = gens[0];
    const Mobius& b = gens[1];
    const Mobius& A = gens[2];
    const Mobius& B = gens[3];

    fp[0].push_back( get_mobius_fixed_points( b*A*B*a )[0] );
    fp[0].push_back( get_mobius_fixed_points( a )[0] );
    fp[0].push_back( get_mobius_fixed_points( B*A*b*a )[0] );

    fp[1].push_back( get_mobius_fixed_points( A*B*a*b )[0] );
    fp[1].push_back( get_mobius_fixed_points( b )[0] );
    fp[1].push_back( get_mobius_fixed_points( a*B*A*b )[0] );

    fp[2].push_back( get_mobius_fixed_points( B*a*b*A )[0] );
    fp[2].push_back( get_mobius_fixed_points( A )[0] );
    fp[2].push_back( get_mobius_fixed_points( b*a*B*A )[0] );

    fp[3].push_back( get_mobius_fixed_points( a*b*A*B )[0] );
    fp[3].push_back( get_mobius_fixed_points( B )[0] );
    fp[3].push_back( get_mobius_fixed_points( A*b*a*B )[0] );

    return fp;
}
