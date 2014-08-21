define('nebula/html', function() {
    'use strict';


    this.ESCAPE_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    var _ESCAPE_MAP_FAST = {};
    for (var c in this.ESCAPE_MAP)
        _ESCAPE_MAP_FAST[c] = [new RegExp(c, 'g'), this.ESCAPE_MAP[c]];


    function escape(s, map) {
        // Escapes HTML special characters with HTML entities.
        s = String(s);
        if (arguments.length === 1) {
            map = _ESCAPE_MAP_FAST;
            for (var c in map)
                s = s.replace.apply(s, map[c]);
        } else
            for (var c in map)
                s = s.replace(new RegExp(c, 'g'), map[c]);
        return s;
    }


    return define.functions(escape);
});
