define('nebula/easings', function() {
    'use strict';


    function mirror(p) {
        return 1 - 2 * Math.abs(p - 0.5);
    }


    function linear(p) {
        return p;
    }


    var quadratic = {
        'in': function(p) {
            // Modeled after the parabola y = x^2
            return p * p;
        },
        'out': function(p) {
            // Modeled after the parabola y = -x^2 + 2x
            return p * (2 - p);
        },
        'inOut': function(p) {
            // Modeled after the piecewise quadratic
            // y = (1/2)((2x)^2)             ; [0, 0.5)
            // y = -(1/2)((2x-1)*(2x-3) - 1) ; [0.5, 1]
            if (p < 0.5)
                return 2 * p * p;
            else
                return -2*p*p + 4*p - 1;
        }
    };


    var cubic = {
        'in': function(p) {
            // Modeled after the cubic y = x^3
            return p * p * p;
        },
        'out': function(p) {
            // Modeled after the cubic y = (x - 1)^3 + 1
            var f = p - 1;
            return f*f*f + 1;
        },
        'inOut': function(p) {
            // Modeled after the piecewise cubic
            // y = (1/2)((2x)^3)       ; [0, 0.5)
            // y = (1/2)((2x-2)^3 + 2) ; [0.5, 1]
            if (p < 0.5)
                return 4 * p * p * p;
            else {
                var f = 2*p - 2;
                return 0.5*f*f*f + 1;
            }
        }
    };


    var quartic = {
        'in': function(p) {
            // Modeled after the quartic x^4
            return p * p * p * p;
        },
        'out': function(p) {
            // Modeled after the quartic y = 1 - (x - 1)^4
            var f = p - 1;
            return f * f * f * (1 - p) + 1;
        },
        'inOut': function(p) {
            // Modeled after the piecewise quartic
            // y = (1/2)((2x)^4)        ; [0, 0.5)
            // y = -(1/2)((2x-2)^4 - 2) ; [0.5, 1]
            if (p < 0.5)
                return 8 * p * p * p * p;
            else {
                var f = p - 1;
                return -8 * f * f * f * f + 1;
            }
        }
    };


    var quintic = {
        'in': function(p) {
            // Modeled after the quintic y = x^5
            return p * p * p * p * p;
        },
        'out': function(p) {
            // Modeled after the quintic y = (x - 1)^5 + 1
            var f = p - 1;
            return f * f * f * f * f + 1;
        },
        'inOut': function(p) {
            // Modeled after the piecewise quintic
            // y = (1/2)((2x)^5)       ; [0, 0.5)
            // y = (1/2)((2x-2)^5 + 2) ; [0.5, 1]
            if (p < 0.5)
                return 16 * p * p * p * p * p;
            else {
                var f = 2*p - 2;
                return  0.5 * f * f * f * f * f + 1;
            }
        }
    };


    var sine = {
        'in': function(p) {
            // Modeled after quarter-cycle of sine wave
            return Math.sin((p - 1) * Math.PI / 2) + 1;
        },
        'out': function(p) {
            // Modeled after quarter-cycle of sine wave (different phase)
            return Math.sin(p * Math.PI / 2);
        },
        'inOut': function(p) {
            // Modeled after half sine wave
            return 0.5 * (1 - Math.cos(p * Math.PI));
        }
    };


    var circular = {
        'in': function(p) {
            // Modeled after shifted quadrant IV of unit circle
            return 1 - Math.sqrt(1 - p*p);
        },
        'out': function(p) {
            // Modeled after shifted quadrant II of unit circle
            return Math.sqrt((2 - p) * p);
        },
        'inOut': function(p) {
            // Modeled after the piecewise circular function
            // y = (1/2)(1 - sqrt(1 - 4x^2))           ; [0, 0.5)
            // y = (1/2)(sqrt(-(2x - 3)*(2x - 1)) + 1) ; [0.5, 1]
            if (p < 0.5)
                return 0.5 * (1 - Math.sqrt(1 - 4*p*p));
            else
                return 0.5 * (Math.sqrt(-(2*p - 3) * (2*p - 1)) + 1);
        }
    };


    var exponential = {
        'in': function(p) {
            // Modeled after the exponential function y = 2^(10(x - 1))
            return (p == 0) ? p : Math.pow(2, 10 * (p - 1));
        },
        'out': function(p) {
            // Modeled after the exponential function y = -2^(-10x) + 1
            return (p == 1) ? p : 1 - Math.pow(2, -10 * p);
        },
        'inOut': function(p) {
            // Modeled after the piecewise exponential
            // y = (1/2)2^(10(2x - 1))         ; [0,0.5)
            // y = -(1/2)*2^(-10(2x - 1))) + 1 ; [0.5,1]
            if (p == 0.0 || p == 1.0)
                return p;
            if (p < 0.5)
                return 0.5 * Math.pow(2, 20*p - 10);
            else
                return -0.5 * Math.pow(2, -20*p + 10) + 1;
        }
    };


    var elastic = {
        'in': function(p) {
            // Modeled after the damped sine wave y = sin(13pi/2*x)*pow(2, 10 * (x - 1))
            return Math.sin(13 * Math.PI / 2 * p) * Math.pow(2, 10 * (p - 1));
        },
        'out': function(p) {
            // Modeled after the damped sine wave y = sin(-13pi/2*(x + 1))*pow(2, -10x) + 1
            return Math.sin(-13 * Math.PI / 2 * (p + 1)) * Math.pow(2, -10 * p) + 1;
        },
        'inOut': function(p) {
            // Modeled after the piecewise exponentially-damped sine wave:
            // y = (1/2)*sin(13pi/2*(2*x))*pow(2, 10 * ((2*x) - 1))      ; [0,0.5)
            // y = (1/2)*(sin(-13pi/2*((2x-1)+1))*pow(2,-10(2*x-1)) + 2) ; [0.5, 1]
            if (p < 0.5)
                return 0.5 * Math.sin(13 * Math.PI / 2 * 2 * p) * Math.pow(2, 10 * (2*p - 1));
            else
                return 0.5 * (Math.sin(-13 * Math.PI / 2 * ((2*p - 1) + 1)) * Math.pow(2, -10 * (2*p - 1)) + 2);
        }
    };


    var back = {
        'in': function(p) {
            // Modeled after the overshooting cubic y = x^3-x*sin(x*pi)
            return p*p*p - p*Math.sin(p * Math.PI);
        },
        'out': function(p) {
            // Modeled after overshooting cubic y = 1-((1-x)^3-(1-x)*sin((1-x)*pi))
            var f = 1 - p;
            return 1 - (f*f*f - f*Math.sin(f * Math.PI));
        },
        'inOut': function(p) {
            // Modeled after the piecewise overshooting cubic function:
            // y = (1/2)*((2x)^3-(2x)*sin(2*x*pi))           ; [0, 0.5)
            // y = (1/2)*(1-((1-x)^3-(1-x)*sin((1-x)*pi))+1) ; [0.5, 1]
            if (p < 0.5) {
                var f = 2 * p;
                return 0.5 * (f*f*f - f*Math.sin(f * Math.PI));
            } else {
                var f = 1 - (2*p - 1);
                return 0.5 * (1 - (f*f*f - f*Math.sin(f * Math.PI))) + 0.5;
            }
        }
    };


    var bounce = {
        'in': function(p) {
            return 1 - bounce.out(1 - p);
        },
        'out': function(p) {
            if (p < 4/11)
                return (121 * p * p) / 16;
            else if (p < 8/11)
                return 363/40*p*p - 99/10*p + 17/5;
            else if (p < 9/10)
                return 4356/361*p*p - 35442/1805*p + 16061/1805;
            else
                return 54/5*p*p - 513/25*p + 268/25;
        },
        'inOut': function(p) {
            if (p < 0.5)
                return 0.5 * bounce.in(p * 2);
            else
                return 0.5 * bounce.out(p*2 - 1) + 0.5;
        }
    };


    function cubicBezier(x1, y1, x2, y2) {
        /*
         * Source: https://github.com/gre/bezier-easing
         *
         * Generates Bezier Curve based easing functions.
         *
         * Usage:
         *
         *     var spline = cubicBezier(0.25, 0.1, 0.25, 1);
         *     spline(p);  // Returns the easing value. `p` must be in [0, 1] range.
         */

        // Validate arguments
        if (arguments.length !== 4)
            throw new Error('`cubicBezier()` requires 4 arguments.');
        for (var i = 0; i < 4; ++i)
            if (typeof arguments[i] !== 'number' || isNaN(arguments[i]) || !isFinite(arguments[i]))
                throw new Error('`cubicBezier()` arguments must be numbers.');
        if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1)
            throw new Error('`cubicBezier()` x values must be in [0, 1] range.');
        if (x1 === y1 && x2 === y2)
            return linear;

        // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
        function calcBezier(t, a1, a2) {
            return (((1 - 3*a2 + 3*a1) * t + (3*a2 - 6*a1)) * t + 3*a1) * t;
        }

        // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
        function slope(t, a1, a2) {
            return (3 - 9*a2 + 9*a1) * t * t + (6*a2 - 12*a1) * t + 3*a1;
        }

        function getTForX(x) {
            // Newton raphson iteration
            var t = x;
            for (var i = 0; i < 8; ++i) {
                var currentSlope = slope(t, x1, x2);
                if (currentSlope === 0)
                    return t;
                var currentX = calcBezier(t, x1, x2) - x;
                t -= currentX / currentSlope;
            }
            return t;
        }

        function f(x) {
            return calcBezier(getTForX(x), y1, y2);
        }
        f.toString = function() {
            return '<cubicBezier ' + [x1, y1, x2, y2] + '>';
        };
        return f;
    }


    return {
        'mirror': mirror,
        'linear': linear,
        'quadratic': quadratic,
        'cubic': cubic,
        'quartic': quartic,
        'quintic': quintic,
        'sine': sine,
        'circular': circular,
        'exponential': exponential,
        'elastic': elastic,
        'back': back,
        'bounce': bounce,
        'cubicBezier': cubicBezier
    };
});
