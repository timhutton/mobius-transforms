#include "mobius.h"

// stdlib
#include <iostream>
#include <vector>
using namespace std::literals;

enum class Recipe { grandma, maskit };

std::vector<Mobius> make_generators(const Recipe recipe, const std::vector<Complex>& control_points)
{
    std::vector<Mobius> transforms(4);

    // gasket:
    transforms[0] << 1.0f, 0.0f, 0.0f - 2.0if, 1.0f;
    transforms[1] << 1.0f - 1.0if, 1.0f, 1.0f, 1.0f + 1.0if;

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
