define('nebula/random', function() {
    'use strict';


    /*
     * PRNG can be overriden to allow unit test this module.
     */
    var generator = Math.random;


    this.setPRNG = function(newGenerator) {
        generator = newGenerator;
    };


    this.sign = function() {
        return generator() < 0.5 ? -1 : 1;
    }


    this.uniform = function() {
        // Returns a random floating point number, can be limited to a given range.
        var min, max;
        if (arguments.length === 0) {
            // uniform();
            min = 0;
            max = Number.MAX_VALUE;
        } else if (arguments.length === 1) {
            // uniform(max);
            min = 0;
            max = arguments[0];
        } else {
            // uniform(min, max);
            min = arguments[0];
            max = arguments[1];
        }
        return min + (max - min) * generator();
    };


    this.integer = function() {
        // Returns a random integer, can be limited to a given range.
        var n = this.uniform.apply(null, arguments);
        // Always truncates value towards zero.
        return n >= 0 ? Math.floor(n) : Math.ceil(n);
    };


    this.choice = function(population) {
        // Returns a random element from an array.
        return population[this.integer(population.length)];
    };


    this.shuffle = function(population) {
        // Shuffles the `population` array in place.
        var i = population.length, j, temp;
        while (--i) {
            j = this.integer(i + 1);
            temp = population[i];
            population[i] = population[j];
            population[j] = temp;
        }
    };


    this.sample = function(population, size) {
        // Returns a `size` length array of unique elements chosen from the `population` array.
        if (size > population.length)
            throw new Error('Sample larger than population');
        var result = new Array(size), i, j;
        if (size > population.length/3) {
            var pool = population.slice(0);
            for (i = 0; i < size; i++) {
                j = this.integer(population.length - i);
                result[i] = pool[j];
                pool[j] = pool[population.length - i - 1];
            }
        } else {
            var selected = [];
            for (i = 0; i < size; i++) {
                do {
                    j = this.integer(population.length);
                } while (selected.indexOf(j) >= 0);
                selected.push(j);
                result[i] = population[j];
            }
        }
        return result;
    };
});
