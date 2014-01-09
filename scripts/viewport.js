/*
 *
 * viewport.is('NAME OTHER_NAME')
 *
 * viewport.onChange.connect(function() {});
 *
 */
define('viewport', ['settings', 'signal'], function(settings, Signal) {
    'use strict';

    var viewports = settings('VIEWPORTS', {});
    var activeViewports = [];
    var change = new Signal();

    function checkViewport(specification) {
        if (typeof specification === 'function') {
            if (specification())
                return true;
        } else if (specification instanceof Array) {
            if (specification[0] <= width() && width() <= specification[1])
                return true;
        } else if (typeof specification === 'string') {
            if (!window.matchMedia)
                throw new Error('`window.matchMedia` not available in this browser');
            if (window.matchMedia(specification).matches)
                return true;
        }

        return false;
    }

    function checkViewports() {
        var results = [], alias, i;
        var oldViewports = activeViewports.slice();

        for (alias in viewports)
            if (checkViewport(viewports[alias]))
                results.push(alias);

        activeViewports = results;

        if (oldViewports.length != results.length)
            change.send(oldViewports, results.slice());
        else {
            for (i = 0; i < results.length; i++) {
                if (oldViewports.indexOf(results[i]) == -1) {
                    change.send(oldViewports, results.slice());
                    break;
                }
            }
        }

        return results;
    }

    function is(aliases) {
        var i, alias;
        aliases = aliases.split(' ');
        for (i = 0; i < aliases.length; i++) {
            alias = aliases[i];
            if (!(alias in viewports))
                throw new Error('unknown viewport alias: ' + alias);
            if (activeViewports.indexOf(alias) >= 0)
                return true;
        }
        return false;
    }

    function get() {
        return activeViewports;
    }

    function width() {
        return window.innerWidth;
    }

    function height() {
        return window.innerHeight;
    }

    function enable() {
        checkViewports();
        window.addEventListener('resize', checkViewports);
    }

    function disable() {
        window.removeEventListener('resize', checkViewports);
    }

    return {
        '_check': checkViewports,
        'is': is,
        'get': get,
        'change': change,
        'width': width,
        'height': height,
        'enable': enable,
        'disable': disable
    }
});
