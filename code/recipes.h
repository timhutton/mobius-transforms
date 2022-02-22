#include "mobius.h"

// stdlib
#include <vector>
using namespace std::literals;

enum class Recipe { grandma, maskit };

std::vector<Mobius> get_transforms(const Recipe recipe, const std::vector<Complex>& control_points)
{
    std::vector<Mobius> transforms(4);

    // gasket:
    transforms[0] << 1.0f, 0.0f, 0.0f - 2.0if, 1.0f;
    transforms[1] << 1.0f - 1.0if, 1.0f, 1.0f, 1.0f + 1.0if;

    transforms[2] = transforms[0].inverse();
    transforms[3] = transforms[1].inverse();
    return transforms;
}
