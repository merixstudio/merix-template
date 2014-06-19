describe('utils/callable.js', function() {
    var callable = require('nebula/utils/callable');

    describe('`callable()`', function() {
        it('turns objects into callable functions', function() {
            function Cls(attr) {
                this.attr = attr;
            }
            Cls = callable(Cls);
            Cls.prototype.__call__ = function() {
                return this.attr;
            };

            var inst = new Cls(99);
            expect(inst()).toBe(99);
            expect(inst instanceof Cls).toBe(true);
        });
        /*
        it("throws an exception when class doesn't contain a `call()` method", function() {
            // This test doesn't work in IE8.
            function Cls(attr) {
                this.attr = attr;
            }
            Cls = callable(Cls);

            var inst = new Cls(99);
            expect(inst).toThrow();
        });
        */
    });
});
