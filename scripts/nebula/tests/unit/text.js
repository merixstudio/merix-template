describe('text.js', function() {
    var text = require('nebula/text');

    describe('`escape()`', function() {
        it('converts HTML special characters to HTML entities: < > & " \'', function() {
            // Characters are doubled to ensure that all occurences are escaped and not only the first ones.
            expect(text.escape('<>&"\'<>&"\'')).toBe('&lt;&gt;&amp;&quot;&#39;&lt;&gt;&amp;&quot;&#39;');
        });
        it('converts characters when custom map is specified', function() {
            // Characters are doubled to ensure that all occurences are escaped and not only the first ones.
            var map = {'a': 'b', 'c': 'd', 'e': 'f'};
            expect(text.escape('aceace', map)).toBe('bdfbdf');
        });
    });
});
