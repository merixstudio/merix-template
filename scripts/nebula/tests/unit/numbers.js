describe('number.js', function() {
    var numbers = require('nebula/numbers');

    function MagicNumber(a) {
        this.value = a;
    }

    MagicNumber.prototype.valueOf = function() {
        return this.value;
    };

    describe('`sum()`', function() {
        it('returns sum of passed arguments', function() {
            expect(numbers.sum(0, 1, 2, 3)).toBe(6);
            expect(numbers.sum([0, 1, 2, 3])).toBe(6);
            expect(numbers.sum([0, 1], [2, 3])).toBe(6);
            expect(numbers.sum([0, 1], 2, 3)).toBe(6);
            expect(numbers.sum([0, 1, [1, 2]], 2, 3)).toBe(9);
            expect(numbers.sum([0, -1, [-1, -2]], -2, -3)).toBe(-9);
        });

        it('returns sum of passed arguments that are convertible to numbers', function() {
            expect(numbers.sum(new MagicNumber(3))).toBe(3);
            expect(numbers.sum(new MagicNumber(3), [new MagicNumber(4), new MagicNumber(5)])).toBe(12);
        });

        it('throws typeError when an argument cannot be converted to a number', function() {
            expect(numbers.sum.bind(undefined, 'asd', 2, 3)).toThrow();
        });
    });

    describe('`multiply()`', function() {
        it('returns product of passed arguments', function() {
            expect(numbers.multiply(0, 1)).toBe(0);
            expect(numbers.multiply([1, 2, 3])).toBe(6);
            expect(numbers.multiply(1, [2, 3])).toBe(6);
            expect(numbers.multiply([1, [1, 2]], 2, 3)).toBe(12);
            expect(numbers.multiply([-1, [-1, -2]], -2, -3)).toBe(-12);
        });

        it('returns product of passed arguments that are convertible to numbers', function() {
            expect(numbers.multiply(new MagicNumber(3))).toBe(3);
            expect(numbers.multiply(new MagicNumber(3), [new MagicNumber(4), new MagicNumber(5)])).toBe(60);
        });

        it('throws typeError when an argument cannot be converted to a number', function() {
            expect(numbers.multiply.bind(undefined, 'asd', 2, 3)).toThrow();
        });
    });

    describe('`mod()`', function() {
        it('when dividend is negative result is positive', function() {
            expect(numbers.mod(-9, 5)).toBe(1);
        });
        it('when divisor is negative result is negative', function() {
            expect(numbers.mod(9, -5)).toBe(-1);
        });
    });

    describe('`clamp()`', function() {
        it('returns value unchanged when it is not exceeding bounds', function() {
            expect(numbers.clamp(1, 0, 2)).toBe(1);
        });
        it('returns upper limit when value is greater', function() {
            expect(numbers.clamp(3, 0, 2)).toBe(2);
        });
        it('returns lower limit when value is smaller', function() {
            expect(numbers.clamp(-1, 0, 2)).toBe(0);
        });
    });

    describe('`scale()`', function() {
        it('scales value linearly from one range to another', function() {
            expect(numbers.scale(15, 10, 20, 0, 100)).toBe(50);
            expect(numbers.scale(1, 0, 1, -100, 100)).toBe(100);
            expect(numbers.scale(0, 0, 1, -100, 100)).toBe(-100);
            expect(numbers.scale(0, -1, 1, 1, 3)).toBe(2);
        });
    });

    describe('`range()`', function() {
        it('returns proper array of numbers when only the `stop` argument is specified', function() {
            expect(numbers.range(3)).toEqual([0, 1, 2]);
            expect(numbers.range(-3)).toEqual([0, -1, -2]);
        });
        it('returns proper array of numbers when the `start` and `stop` arguments are specified', function() {
            expect(numbers.range(5, 10)).toEqual([5, 6, 7, 8, 9]);
            expect(numbers.range(-5, -10)).toEqual([-5, -6, -7, -8, -9]);
        });
        it('returns proper array of numbers when the `step` argument is specified', function() {
            expect(numbers.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
            expect(numbers.range(0, -10, -2)).toEqual([0, -2, -4, -6, -8]);
        });
    });

    describe('`format()`', function() {
        it("doesn't require any arguments besides the number", function() {
            expect(numbers.format(123456.789)).toBe('123,456.79');  // Rounding up!
            expect(numbers.format(1)).toBe('1.00');
            expect(numbers.format(-1)).toBe('-1.00');
        });
        it('allows to change number of digits after decimal point', function() {
            expect(numbers.format(0.12345, 0)).toBe('0');
            expect(numbers.format(0.9, 0)).toBe('1');  // Rounding up!
            expect(numbers.format(0.12345, 1)).toBe('0.1');
            expect(numbers.format(0.12345, 2)).toBe('0.12');
            expect(numbers.format(0.12345, 3)).toBe('0.123');
            expect(numbers.format(0.12345, 4)).toBe('0.1235');  // Rounding up!
            expect(numbers.format(0.12345, 5)).toBe('0.12345');
            expect(numbers.format(1, 5)).toBe('1.00000');
        });
        it('allows to change decimal separator character', function() {
            expect(numbers.format(0.12345, 0, ':')).toBe('0');
            expect(numbers.format(0.12345, 1, ':')).toBe('0:1');
            expect(numbers.format(1, 5, ':')).toBe('1:00000');
            expect(numbers.format(0.12345, 2, ' any string can be here ')).toBe('0 any string can be here 12');
        });
        it('allows to change thounsands separator character', function() {
            expect(numbers.format(123456789.123456, 0, ':', ' ')).toBe('123 456 789');
            expect(numbers.format(123456789.123456, 1, ':', ' ')).toBe('123 456 789:1');
            expect(numbers.format(123456789.123456, 2, ':', ' any string ')).toBe('123 any string 456 any string 789:12');
        });
    });

    describe('`distance()`', function() {
        it("properly measures distance between two points", function() {
            expect(numbers.distance(1, 1, 4, 1)).toBe(3);
            expect(numbers.distance(1, 1, 1, 3)).toBe(2);
            expect(numbers.distance(0, 0, 1, 1)).toBe(Math.sqrt(2));
            expect(numbers.distance(1, 1, 4, 5)).toBe(5);
            expect(numbers.distance(-1, -1, -4, -1)).toBe(3);
            expect(numbers.distance(-1, -1, -1, -3)).toBe(2);
            expect(numbers.distance(0, 0, -1, -1)).toBe(Math.sqrt(2));
            expect(numbers.distance(-1, -1, -4, -5)).toBe(5);
        });
    });

    describe('`radians()`', function() {
        it("properly converts degrees to radians", function() {
            expect(numbers.radians(0)).toBe(0);
            expect(numbers.radians(90)).toBe(Math.PI/2);
            expect(numbers.radians(180)).toBe(Math.PI);
            expect(numbers.radians(360)).toBe(Math.PI*2);
        });
    });

    describe('`degrees()`', function() {
        it("properly converts radians to degrees", function() {
            expect(numbers.degrees(0)).toBe(0);
            expect(numbers.degrees(Math.PI/2)).toBe(90);
            expect(numbers.degrees(Math.PI)).toBe(180);
            expect(numbers.degrees(Math.PI*2)).toBe(360);
        });
    });


    describe('`isPowerOfTwo()`', function() {
        it("properly identifies power of two's up to 2^31", function() {
            for (var power = 0; power <= 31; power++)
                expect(numbers.isPowerOfTwo(Math.pow(2, power))).toBe(true);
        });
        it("returns `false` for negative and decimal numbers", function() {
            var values = [-1, -2, -3, -4, -5, -6, 0.5, 0, -0.5, 2.1, 3.5, 4.5, 8.5];
            for (var i = 0; i < values.length; i++)
                expect(numbers.isPowerOfTwo(values[i])).toBe(false);
        });
    });


    describe('`nextPowerOfTwo()`', function() {
        it("when called with power of 2, it just returns it", function() {
            for (var power = 0; power <= 31; power++) {
                var n = Math.pow(2, power);
                expect(numbers.nextPowerOfTwo(n)).toBe(n);
            }
        });
        it("returns 1 when called with argument less than 1", function() {
            var values = [-2, -1, -0.5, 0, 0.5, 0.9];
            for (var i = 0; i < values.length; i++)
                expect(numbers.nextPowerOfTwo(values[i])).toBe(1);
        });
        it("finds correct power of 2 up to 2^31", function() {
            for (var power = 2; power <= 31; power++) {
                var n = Math.pow(2, power);
                expect(numbers.nextPowerOfTwo(n-1)).toBe(n);
            }
        });
    });
});
