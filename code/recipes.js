/*  mobius-transforms - Exploring Möbius transformations and implementing the book Indra's Pearls
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

function get_recipes()
{
    // start_letters: default is [0, 3, 2, 1] ie. aBAb

    const prec = 6;

    var fuchsian = { id: 'fuchsian', label: "Fuchsian", control_points: [], pt_labels: [], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, page 163
            var transforms = [];
            var root2 = Math.sqrt( 2.0 );
            transforms[0] = [ p2(root2, 0.0), p2(0.0, 1.0), p2(0.0, -1.0), p2(root2, 0.0) ];
            transforms[1] = [ p2(root2, 0.0), p2(1.0, 0.0), p2(1.0, 0.0),  p2(root2, 0.0) ];
            var description = "Fuchsian recipe from Indra's Pearls, p. 163.";
            return [transforms, description];
        }
    };
    var theta_schottky = { id: 'thetaSchottky', label: "\u03B8-Schottky",
        control_points: [ p2(0.6, 0.5) ], pt_labels: [ '\u03B8' ], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, page 118
            var theta = Math.atan2( control_points[0].y, control_points[0].x );
            var sin_theta = Math.sin( theta );
            var cos_theta = Math.cos( theta );
            var transforms = [];
            transforms[0] = [ p2( 1.0 / sin_theta, 0.0 ), p2( 0.0, cos_theta / sin_theta), p2( 0.0, -cos_theta / sin_theta ), p2( 1.0 / sin_theta, 0.0 ) ];
            transforms[1] = [ p2( 1.0 / sin_theta, 0.0 ), p2( cos_theta / sin_theta, 0.0 ), p2( cos_theta / sin_theta, 0.0 ), p2( 1.0 / sin_theta, 0.0 ) ];
            var description = `\u03B8-Schottky recipe from Indra's Pearls with \u03B8 = ${theta.toFixed(prec)}`;
            return [transforms, description];
        }
    };

    var kissing_schottky = { id: 'kissingSchottky', label: "kissing Schottky",
        control_points: [ p2(0.91, 1.08) ], pt_labels: [ 'yv' ], num_solutions: 2,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 170
            var y = control_points[0].x;
            var v = control_points[0].y;
            var x = Math.sqrt( 1.0 + y * y );
            var u = Math.sqrt( 1.0 + v * v );
            var s = 2.0 / ( y * v );
            var t = Math.max( 0.0, s * s - 4.0 ); // (not sure how to handle complex k)
            var k = ( s + [1.0, -1.0][which_solution] * Math.sqrt( t ) ) / 2.0;
            var transforms = [];
            transforms[0] = [ p2(x, 0.0), p2(y, 0.0), p2(y, 0.0), p2(x, 0.0) ];
            transforms[1] = [ p2(u, 0.0), p2(0.0, k * v), p2(0.0, -v / k), p2(u, 0.0) ];
            var description = `Kissing Schottky recipe from Indra's Pearls, p. 170. With x = ${x.toFixed(prec)}, y = ${y.toFixed(prec)}, u = ${u.toFixed(prec)}, v = ${v.toFixed(prec)}, k = ${k.toFixed(prec)}`;
            return [transforms, description];
        }
    };

    var gasket = { id: 'gasket', label: "gasket", control_points: [], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            var transforms = [];
            transforms[0] = [ p2( 1.0, 0.0 ), p2( 0.0, 0.0), p2( 0.0, -2.0 ), p2( 1.0, 0.0 ) ];
            transforms[1] = [ p2( 1.0, -1.0 ), p2( 1.0, 0.0 ), p2( 1.0, 0.0 ), p2( 1.0, 1.0 ) ];
            var description = "Gasket recipe from Indra's Pearls, p. 201";
            return [transforms, description];
        },
        start_letters: [0],
        duplicate: 'rot180'
    };

    var modular = { id: 'modular', label: "modular group", control_points: [], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            var transforms = [];
            transforms[0] = [ p2( 1.0, 0.0 ), p2( 0.0, 0.0), p2( -2.0, 0.0 ), p2( 1.0, 0.0 ) ];
            transforms[1] = [ p2( 1.0, 0.0 ), p2( 2.0, 0.0 ), p2( 0.0, 0.0 ), p2( 1.0, 0.0 ) ];
            var description = "The modular group recipe from Indra's Pearls, p. 214";
            return [transforms, description];
        }
    };

    var maskit = { id: 'maskit', label: "Maskit recipe",
        control_points: [ p2(0, 2.0) ], pt_labels: [ 'mu' ], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 259
            var mu = control_points[0];
            var transforms = [];
            transforms[0] = [ mu, p2(1.0, 0.0), p2(1.0, 0.0), p2(0.0, 0.0) ];              // a: z -> mu + 1/z = (mu*z+1)/z
            transforms[1] = [ p2(1.0, 0.0), p2(2.0, 0.0), p2(0.0, 0.0),  p2(1.0, 0.0) ];   // b: z -> z + 2
            var description = "Maskit recipe from Indra's Pearls, p. 259 with \u03BC = " + format_complex(mu);
            return [transforms, description];
        },
        start_letters: [0],
        duplicate: 'maskit'
    };

    var maskit2 = { id: 'maskit2', label: "Maskit recipe 2",
        control_points: [ p2(0, 2.0) ], pt_labels: [ 'mu' ], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 259, plus Jos Leys' b-variation (http://www.josleys.com/articles/Kleinian%20escape-time_3.pdf)
            var mu = control_points[0];
            var k = p2(2.0 * Math.cos(Math.PI / 5.0), 0.0);
            var transforms = [];
            transforms[0] = [ mu, p2(1.0, 0.0), p2(1.0, 0.0), p2(0.0, 0.0) ];      // a: z -> mu + 1/z = (mu*z+1)/z
            transforms[1] = [ p2(1.0, 0.0), k, p2(0.0, 0.0),  p2(1.0, 0.0) ];      // b: z -> z + k
            var description = "Maskit recipe from Indra's Pearls, p. 259 with \u03BC = " + format_complex(mu) + ", plus <a href=\"http://www.josleys.com/articles/Kleinian%20escape-time_3.pdf\">Jos Leys' b-variation</a> with k = 2cos(pi/5)";
            return [transforms, description];
        }
    };

    var maskit3 = { id: 'maskit3', label: "Maskit recipe 3",
        control_points: [ p2(0, 2.0) ], pt_labels: [ 'mu' ], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 259, plus Jos Leys' b-variation (http://www.josleys.com/articles/Kleinian%20escape-time_3.pdf)
            var mu = control_points[0];
            var k = p2(2.0 * Math.cos(Math.PI / 4.0), 0.0);
            var transforms = [];
            transforms[0] = [ mu, p2(1.0, 0.0), p2(1.0, 0.0), p2(0.0, 0.0) ];      // a: z -> mu + 1/z = (mu*z+1)/z
            transforms[1] = [ p2(1.0, 0.0), k, p2(0.0, 0.0),  p2(1.0, 0.0) ];      // b: z -> z + k
            var description = "Maskit recipe from Indra's Pearls, p. 259 with \u03BC = " + format_complex(mu) + ", plus <a href=\"http://www.josleys.com/articles/Kleinian%20escape-time_3.pdf\">Jos Leys' b-variation</a> with k = 2cos(pi/4)";
            return [transforms, description];
        }
    };

    var grandma = { id: 'grandma',
        label: "Grandma's recipe",
         num_solutions: 2,
        control_points: [ p2(2.4, 0.0), p2(2.37, 0.34) ],
        //control_points: [ p2(1.87, 0.1), p2(1.87, -0.1) ], // for debugging the necks
        //control_points: [ p2(2.0, -1.0), p2(3.0, 0.0) ], // Fig. 8.16, p. 247, needing aaB
        //control_points: [ p2(1.958591030,-0.011278560), p2(2.0, 0.0) ], //Fig. 9.1, p. 269
        //control_points: [ p2(1.64213876,-0.76658841), p2(2.0, 0.0) ], //Fig. 9.3, p. 272
        //control_points: [ p2(0.136998688,1.80785524), p2(2.0, 0.0) ], //Fig. 9.16, p. 295 ?
        //control_points: [ p2(1.5306639,-0.8501047), p2(1.5306639,0.8501047) ], //Fig. 9.19, p. 298
        pt_labels: [ 'ta', 'tb' ],
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 227
            var t_a = control_points[0];
            var t_b = control_points[1];
            // solve x^2 - t_a * t_b * x + t_a^2 + t_b^2 = 0 for x
            var solutions = complex_solve_quadratic( p2( 1.0, 0.0 ), mul( mul_complex( t_a, t_b ), -1.0 ), add( mul_complex( t_a, t_a ), mul_complex( t_b, t_b ) ) );
            var t_ab = solutions[which_solution]; // pick one
            var z0 = div_complex( mul_complex( sub( t_ab, p2( 2.0, 0.0 ) ), t_b ),
                                  add( sub( mul_complex( t_b, t_ab ), mul( t_a, 2.0 ) ), mul_complex( p2( 0.0, 2.0 ), t_ab ) ) );
            var transforms = [];
            transforms[0] = [ mul( t_a, 0.5 ),
                              div_complex( add( sub( mul_complex( t_a, t_ab ), mul( t_b, 2.0 ) ), p2( 0.0, 4.0 ) ), mul_complex( add( mul( t_ab, 2.0 ), p2( 4.0, 0.0 ) ), z0 ) ),
                              div_complex( mul_complex( sub( sub( mul_complex( t_a, t_ab ), mul( t_b, 2.0 ) ), p2( 0.0, 4.0 ) ), z0 ), sub( mul( t_ab, 2.0 ), p2( 4.0, 0.0 ) ) ),
                              mul( t_a, 0.5 ) ];
            transforms[1] = [ mul( sub( t_b, p2( 0.0, 2.0 ) ), 0.5 ), mul( t_b, 0.5 ), mul( t_b, 0.5 ), mul( add( t_b, p2( 0.0, 2.0 ) ), 0.5 ) ];
            var description = "Grandma's recipe from Indra's Pearls, p. 227. With t<sub>a</sub> = " + format_complex(t_a) + ", t<sub>b</sub> = " + format_complex(t_b);
            return [transforms, description];
        },
        start_letters: [0, 3, 2, 1], // [0], DEBUG: make slow
        //duplicate: 'rot180' // DEBUG: make slow
    };

    var riley = { id: 'riley', label: "Riley's recipe",
        control_points: [ p2(0.1, 0.93) ], pt_labels: [ 'c' ], num_solutions: 1,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 258
            var c = control_points[0];
            var transforms = [];
            transforms[0] = [ p2( 1.0, 0.0 ), p2( 0.0, 0.0 ), c,              p2( 1.0, 0.0 ) ];
            transforms[1] = [ p2( 1.0, 0.0 ), p2( 2.0, 0.0 ), p2( 0.0, 0.0 ), p2( 1.0, 0.0 ) ];
            var description = "Riley's recipe from Indra's Pearls, p. 258. With c = " + format_complex(c);
            return [transforms, description];
        },
        start_letters: [0],
        duplicate: 'rot180_and_rep_x_2'
    };

    var jorgensen = { id: 'jorgensen', label: "Jørgensen's recipe",
        control_points: [ p2(1.87, 0.1), p2(1.87, -0.1) ], pt_labels: [ 'ta', 'tb' ], num_solutions: 2,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 256
            var t_a = control_points[0];
            var t_b = control_points[1];
            // solve x^2 - t_a * t_b * x + t_a^2 + t_b^2 = 0 for x
            var solutions = complex_solve_quadratic( p2( 1.0, 0.0 ), mul( mul_complex( t_a, t_b ), -1.0 ), add( mul_complex( t_a, t_a ), mul_complex( t_b, t_b ) ) );
            var t_ab = solutions[which_solution]; // pick one
            var transforms = [];
            transforms[0] = [ sub( t_a, div_complex( t_b, t_ab ) ), div_complex( t_a, mul_complex( t_ab, t_ab ) ), t_a, div_complex( t_b, t_ab ) ];
            transforms[1] = [ sub( t_b, div_complex( t_a, t_ab ) ), mul( div_complex( t_b, mul_complex( t_ab, t_ab ) ), -1.0 ), mul( t_b, -1.0 ), div_complex( t_a, t_ab ) ];
            var description = "Jørgensen's recipe from Indra's Pearls, p. 256. With t<sub>a</sub> = " + format_complex(t_a) + ", t<sub>b</sub> = " + format_complex(t_b);
            return [transforms, description];
        }
        // TODO: find a stretch of letters that can be duplicated
    };

    var special = { id: 'special',
        label: "Grandma's four-alarm special",
        //control_points: [ p2(1.87, -0.08), p2(1.87, 0.1), p2(-1.87, 0.05) ],
        control_points: [ p2(1.87, 0.08), p2(1.87, -0.1), p2(1.79, -1.948) ], // discovered
        //control_points: [ p2(1.863, -0.072), p2(1.900, 0.1), p2(1.79, 1.948) ], // discovered
        //control_points: [ p2(1.924781, -0.047529), p2(2.0, 0.0), p2(0.0, 0.0) ], // Fig. 11.1, p. 354 ?
        pt_labels: [ 'ta', 'tb', 'tab' ],
        num_solutions: 2,
        make_generators: (which_solution, control_points) => {
            // Indra's Pearls, p. 260
            // not sure this is working correctly. will need to explore when have better rendering.
            var t_a = control_points[0];
            var t_b = control_points[1];
            var t_ab = control_points[2];
            var t_C = sub( sub( add( add( mul_complex( t_a, t_a ), mul_complex( t_b, t_b ) ), mul_complex( t_ab, t_ab ) ),
                mul_complex( mul_complex( t_a, t_b ), t_ab ) ), p2(2.0, 0.0) );
            var Q = mul( sqrt_complex( sub( p2( 2.0, 0.0 ), t_C ) ), which_solution==0?1.0:-1.0 );
            var sign = 1.0;
            var sqrt_tc_plus_2 = sqrt_complex( add( t_C, p2( 2.0, 0.0 ) ) );
            if( magnitude( add( t_C, mul_complex( mul_complex( p2( 0.0, 1.0 ), Q ), sqrt_tc_plus_2 ) ) ) < 2.0 ) {
                sign = -1.0;
            }
            var R = mul( sqrt_tc_plus_2, sign );
            var z0 = div_complex( mul_complex( sub( t_ab, p2( 2.0, 0.0 ) ), add( t_b, R ) ), add( sub( mul_complex( t_b, t_ab ), mul( t_a, 2.0 ) ),
                mul_complex( mul_complex( p2( 0.0, 1.0 ), Q ), t_ab ) ) );
            var transforms = [];
            transforms[0] = [
                mul( t_a, 0.5 ),
                div_complex( add( sub( mul_complex( t_a, t_ab ), mul( t_b, 2.0 ) ), mul_complex( p2( 0.0, 2.0 ), Q ) ), mul_complex( add( mul( t_ab, 2.0 ), p2( 4.0, 0.0 ) ), z0 ) ),
                div_complex( mul_complex( sub( sub( mul_complex( t_a, t_ab ), mul( t_b, 2.0 ) ), mul_complex( p2( 0.0, 2.0 ), Q ) ), z0 ), sub( mul( t_ab, 2.0 ), p2( 4.0, 0.0 ) ) ),
                mul( t_a, 0.5 ) ];
            transforms[1] = [
                mul( sub( t_b, mul_complex( p2( 0.0, 1.0 ), Q ) ), 0.5 ),
                div_complex( sub( sub( mul_complex( t_b, t_ab ), mul( t_a, 2.0 ) ), mul_complex( mul_complex( p2( 0.0, 1.0 ), Q ), t_ab ) ),
                    mul_complex( add( mul( t_ab, 2.0 ), p2( 4.0, 0.0 ) ), z0 ) ),
                div_complex( mul_complex( add( sub( mul_complex( t_b, t_ab ), mul( t_a, 2.0 ) ), mul_complex( mul_complex( p2( 0.0, 1.0 ), Q ), t_ab ) ), z0 ),
                    sub( mul( t_ab, 2.0 ), p2( 4.0, 0.0 ) ) ),
                mul( add( t_b, mul_complex( p2( 0.0, 1.0 ), Q ) ), 0.5 ) ];
            var description = "Grandma's four alarm special from Indra's Pearls, p. 260. With t<sub>a</sub> = " + format_complex(t_a) + ", t<sub>b</sub> = " + format_complex(t_b)
                + ", t<sub>ab</sub> = " + format_complex(t_ab);
            return [transforms, description];
        },
        start_letters: [0],
        duplicate: 'rot180'
    };

    return [ fuchsian, theta_schottky, kissing_schottky, gasket, modular, maskit, maskit2, maskit3, grandma, riley, jorgensen, special ];
}
