// Eigen
#include <Eigen/Dense>

// stdlib
#define _USE_MATH_DEFINES
#include <cmath>

using Mobius = Eigen::Matrix2cf;
using Complex = std::complex<float>;

Complex mobius_on_point(const Mobius& m, const Complex& z)
{
    if( !isfinite(z.real()) ) {
        // special case for z = inf, return a / c
        return m(0,0) / m(1,1);
    }
    return m(0,0)*z + m(0,1) / ( m(1,0)*z + m(1,1) );
}
