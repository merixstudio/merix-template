define('nebula/text', function() {
    'use strict';


    var ESCAPE_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    var _ESCAPE_MAP_FAST = {};
    for (var c in ESCAPE_MAP)
        _ESCAPE_MAP_FAST[c] = [new RegExp(c, 'g'), ESCAPE_MAP[c]];


    function escape(s, map) {
        // Escapes HTML special characters with HTML entities.
        s = String(s);
        if (arguments.length < 2)
            for (var c in _ESCAPE_MAP_FAST)
                s = s.replace.apply(s, _ESCAPE_MAP_FAST[c]);
        else
            for (var c in map)
                s = s.replace(new RegExp(c, 'g'), map[c]);
        return s;
    }


    return {
        'ESCAPE_MAP': ESCAPE_MAP,
        'escape': escape
    };
});
