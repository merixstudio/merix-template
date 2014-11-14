describe('html.js', function() {
    var html = require('nebula/html');

    describe('`escape()`', function() {
        it('converts HTML special characters to HTML entities: < > & " \'', function() {
            // Characters are doubled to ensure that all occurences are escaped and not only the first ones.
            expect(html.escape('<>&"\'<>&"\'')).toBe('&lt;&gt;&amp;&quot;&#39;&lt;&gt;&amp;&quot;&#39;');
        });
        it('converts characters when custom map is specified', function() {
            // Characters are doubled to ensure that all occurences are escaped and not only the first ones.
            var map = {'a': 'b', 'c': 'd', 'e': 'f'};
            expect(html.escape('aceace', map)).toBe('bdfbdf');
        });
    });
});
