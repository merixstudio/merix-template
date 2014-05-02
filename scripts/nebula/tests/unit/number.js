describe('number.js', function() {
    var number = require('nebula/number');

    describe('`mod()`', function() {
        it('when dividend is negative result is positive', function() {
            expect(number.mod(-9, 5)).toBe(1);
        });
        it('when divisor is negative result is negative', function() {
            expect(number.mod(9, -5)).toBe(-1);
        });
    });

    describe('`clamp()`', function() {
        it('returns value unchanged when it is not exceeding bounds', function() {
            expect(number.clamp(0, 1, 2)).toBe(1);
        });
        it('returns upper limit when value is greater', function() {
            expect(number.clamp(0, 3, 2)).toBe(2);
        });
        it('returns lower limit when value is smaller', function() {
            expect(number.clamp(0, -1, 2)).toBe(0);
        });
    });

    describe('`scale()`', function() {
        it('scales value linearly from one range to another', function() {
            expect(number.scale(15, 10, 20, 0, 100)).toBe(50);
            expect(number.scale(1, 0, 1, -100, 100)).toBe(100);
            expect(number.scale(0, 0, 1, -100, 100)).toBe(-100);
            expect(number.scale(0, -1, 1, 1, 3)).toBe(2);
        });
    });

    describe('`range()`', function() {
        it('returns proper array of numbers when only the `stop` argument is specified', function() {
            expect(number.range(3)).toEqual([0, 1, 2]);
            expect(number.range(-3)).toEqual([0, -1, -2]);
        });
        it('returns proper array of numbers when the `start` and `stop` arguments are specified', function() {
            expect(number.range(5, 10)).toEqual([5, 6, 7, 8, 9]);
            expect(number.range(-5, -10)).toEqual([-5, -6, -7, -8, -9]);
        });
        it('returns proper array of numbers when the `step` argument is specified', function() {
            expect(number.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
            expect(number.range(0, -10, -2)).toEqual([0, -2, -4, -6, -8]);
        });
    });

    describe('`format()`', function() {
        it("doesn't require any arguments besides the number", function() {
            expect(number.format(123456.789)).toBe('123,456.79');  // Rounding up!
            expect(number.format(1)).toBe('1.00');
            expect(number.format(-1)).toBe('-1.00');
        });
        it('allows to change number of digits after decimal point', function() {
            expect(number.format(0.12345, 0)).toBe('0');
            expect(number.format(0.9, 0)).toBe('1');  // Rounding up!
            expect(number.format(0.12345, 1)).toBe('0.1');
            expect(number.format(0.12345, 2)).toBe('0.12');
            expect(number.format(0.12345, 3)).toBe('0.123');
            expect(number.format(0.12345, 4)).toBe('0.1235');  // Rounding up!
            expect(number.format(0.12345, 5)).toBe('0.12345');
            expect(number.format(1, 5)).toBe('1.00000');
        });
        it('allows to change decimal separator character', function() {
            expect(number.format(0.12345, 0, ':')).toBe('0');
            expect(number.format(0.12345, 1, ':')).toBe('0:1');
            expect(number.format(1, 5, ':')).toBe('1:00000');
            expect(number.format(0.12345, 2, ' any string can be here ')).toBe('0 any string can be here 12');
        });
        it('allows to change thounsands separator character', function() {
            expect(number.format(123456789.123456, 0, ':', ' ')).toBe('123 456 789');
            expect(number.format(123456789.123456, 1, ':', ' ')).toBe('123 456 789:1');
            expect(number.format(123456789.123456, 2, ':', ' any string ')).toBe('123 any string 456 any string 789:12');
        });
    });
});
