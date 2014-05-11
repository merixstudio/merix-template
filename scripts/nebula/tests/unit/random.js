describe('random.js', function() {
    /*
     * Disclaimer: testing only type or range of result values.
     */
    var random = require('nebula/random');
    var test = require('nebula/test');


    describe('`sign()`', function() {
        it('returns `-1` half of the time', function() {
            var spy = test.spy([0.4999999999999999]);
            random.setPRNG(spy);
            expect(random.sign()).toBe(-1);
            expect(spy.calls).toBe(1);
        });
        it('returns `1` other half of the time', function() {
            var spy = test.spy([0.5]);
            random.setPRNG(spy);
            expect(random.sign()).toBe(1);
            expect(spy.calls).toBe(1);
        });
    });

    describe('`uniform()`', function() {
        it('returns values in range from 0 to `Number.MAX_VALUE` when called without arguments', function() {
            var spy = test.spy([0, 0.5, 1]);  // Warning: original Math.random() should never return 1!
            random.setPRNG(spy);
            expect(random.uniform()).toBe(0);
            expect(random.uniform()).toBe(Number.MAX_VALUE * 0.5);
            expect(random.uniform()).toBe(Number.MAX_VALUE);
            expect(spy.calls).toBe(3);
        });
        it('returns values in range from 0 to custom max. when called with one argument', function() {
            var spy = test.spy([0, 0.5, 1, 0, 0.5, 1]);
            random.setPRNG(spy);
            expect(random.uniform(2.5)).toBe(0);
            expect(random.uniform(3)).toBe(1.5);
            expect(random.uniform(3.5)).toBe(3.5);
            expect(random.uniform(-2.5)).toBe(0);
            expect(random.uniform(-3)).toBe(-1.5);
            expect(random.uniform(-3.5)).toBe(-3.5);
            expect(spy.calls).toBe(6);
        });
        it('returns values in range from custom min. to custom max. when called with two arguments', function() {
            var spy = test.spy([0, 0.5, 1, 0, 0.5, 1]);
            random.setPRNG(spy);
            expect(random.uniform(2.5, 4)).toBe(2.5);
            expect(random.uniform(2, 5)).toBe(3.5);
            expect(random.uniform(2, 4.5)).toBe(4.5);
            expect(random.uniform(-2.5, -4)).toBe(-2.5);
            expect(random.uniform(-2, -5)).toBe(-3.5);
            expect(random.uniform(-2, -4.5)).toBe(-4.5);
            expect(spy.calls).toBe(6);
        });
    });

    describe('`integer()`', function() {
        it('returns values in range from 0 to `Number.MAX_VALUE` when called without arguments', function() {
            var spy = test.spy([0, 0.5, 1]);  // Warning: original Math.random() should never return 1!
            random.setPRNG(spy);
            expect(random.integer()).toBe(0);
            expect(random.integer()).toBe(Math.floor(Number.MAX_VALUE * 0.5));
            expect(random.integer()).toBe(Number.MAX_VALUE);
            expect(spy.calls).toBe(3);
        });
        it('returns values in range from 0 to custom max. when called with one argument', function() {
            var spy = test.spy([0, 0.5, 1, 0, 0.5, 1]);
            random.setPRNG(spy);
            expect(random.integer(2)).toBe(0);
            expect(random.integer(3)).toBe(1);
            expect(random.integer(3)).toBe(3);
            expect(random.integer(-2)).toBe(0);
            expect(random.integer(-3)).toBe(-1);
            expect(random.integer(-3)).toBe(-3);
            expect(spy.calls).toBe(6);
        });
        it('returns values in range from custom min. to custom max. when called with two arguments', function() {
            var spy = test.spy([0, 0.5, 1, 0, 0.5, 1]);
            random.setPRNG(spy);
            expect(random.integer(2, 4)).toBe(2);
            expect(random.integer(2, 5)).toBe(3);
            expect(random.integer(2, 4)).toBe(4);
            expect(random.integer(-2, -4)).toBe(-2);
            expect(random.integer(-2, -5)).toBe(-3);
            expect(random.integer(-2, -4)).toBe(-4);
            expect(spy.calls).toBe(6);
        });
    });

    describe('`choice()`', function() {
        it('returns one random element from supplied array', function() {
            var spy = test.spy([0, 0.5, 0.999]);
            var choices = ['a', 'b', 'c'];
            random.setPRNG(spy);
            expect(random.choice(choices)).toBe('a');
            expect(random.choice(choices)).toBe('b');
            expect(random.choice(choices)).toBe('c');
            expect(spy.calls).toBe(3);
        });
        it('returns `undefined` for empty arrays', function() {
            var spy = test.spy([0, 0.5, 0.999]);
            var choices = [];
            random.setPRNG(spy);
            expect(random.choice(choices)).toBeUndefined();
            expect(random.choice(choices)).toBeUndefined();
            expect(random.choice(choices)).toBeUndefined();
            expect(spy.calls).toBe(3);
        });
    });

    describe('`shuffle()`', function() {
        it('shuffles an array in place', function() {
            var spy = test.spy([0, 0.5, 0.5, 0]);
            var population = ['a', 'b', 'c'];
            random.setPRNG(spy);
            random.shuffle(population);
            expect(population).toEqual(['c', 'b', 'a']);
            random.shuffle(population);
            expect(population).toEqual(['a', 'c', 'b']);
            expect(spy.calls).toBe(population.length*2 - 2);
        });
        it("doesn't change an input array when it has only one element", function() {
            var spy = test.spy([0]);
            var population = ['a'];
            random.setPRNG(spy);
            random.shuffle(population);
            expect(population).toEqual(['a']);
            expect(spy.calls).toBe(0);
        });
    });

    describe('`sample()`', function() {
        it('returns an empty array when requested sample size is 0', function() {
            var spy = test.spy([0]);
            random.setPRNG(spy);
            expect(random.sample(['a', 'b', 'c'], 0)).toEqual([]);
            expect(spy.calls).toBe(0);
        });
        it("doesn't change the input array in any way", function() {
            var spy = test.spy([0, 0.9, 0.1, 0.8, 0.2, 0.7, 0.3, 0.6, 0.4, 0.5]);
            var population = ['a', 'b', 'c', 'd', 'e'];
            random.setPRNG(spy);
            random.sample(population, 1);
            random.sample(population, 5);
            expect(population).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
        it("returns random elements from the input array (when requested sample size is smaller than 1/3 of population)", function() {
            var spy = test.spy([0, 0.1, 0.9, 0.2, 0.3]);
            var population = 'abcdefghij'.split('');
            random.setPRNG(spy);
            expect(random.sample(population, 1)).toEqual(['a']);
            expect(random.sample(population, 1)).toEqual(['b']);
            expect(random.sample(population, 1)).toEqual(['j']);
            expect(random.sample(population, 2)).toEqual(['c', 'd']);
        });
        it("returns random elements from the input array (when requested sample size is bigger or equal than 1/3 of population)", function() {
            var spy = test.spy([0, 1/9*8, 1/8, 1/7*3,
                                1/10*9, 1/9*8, 1/8*7, 1/7*6, 1/6*5, 1/5*4, 1/4*3, 1/3*2, 1/2, 0,
                                0, 1/9, 1/8*2, 1/7*3, 1/6*4, 0.99, 0.99, 0.99, 0.99, 0.99]);
            var population = 'abcdefghij'.split('');
            random.setPRNG(spy);
            expect(random.sample(population, 4)).toEqual(['a', 'i', 'b', 'd']);
            expect(random.sample(population, 10)).toEqual(['j', 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']);
            expect(random.sample(population, 10)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
        });
    });
});
