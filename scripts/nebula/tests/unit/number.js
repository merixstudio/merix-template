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
});
