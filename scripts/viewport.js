/*
 * Allows to define custom viewports using settings file and then react, when viewport changes (due to browser resize
 * or device orientation change).
 *
 * To specify own viewports add this setting:
 *
 *     'VIEWPORTS': {
 *         'my viewport name': [0, 500],
 *         'other viewport': [501, 1000],
 *         'something else': '(min-width: 1001px) or (max-width: 9999px)',
 *         ...
 *     }
 *
 * Each viewport consists of a alias and specification. A specification may be a function, two-element array or
 * media query string.
 *
 * Only one viewport is active in given moment, even when two specifications are overlapping
 * (random one will be returned), thus it's recommened to define non-overlapping breakpoints.
 */
define('viewport', ['settings', 'signal'], function(settings, Signal) {
    'use strict';

    var VIEWPORTS = settings('VIEWPORTS', {});
    var VIEWPORT_CLASS_PREFIX = settings('VIEWPORT_CLASS_PREFIX', 'viewport-');
    var active = null, portrait = null;
    var onChange = new Signal();

    function _check(specification) {
        /*
         * Returns `true` if given viewport specification (may be a function, array or media query string)
         * is active.
         */
        if (typeof specification === 'function')
            return specification();
        else if (specification instanceof Array)
            return specification[0] <= width() && width() <= specification[1];
        else if (typeof specification === 'string') {
            if (!window.matchMedia)
                throw new Error('matchMedia is not available in this browser, please add a polyfill');
            return matchMedia(specification).matches;
        }
        throw new Error('Invalid viewport specification: ' + specification);
    }

    function _update() {
        var old = active, oldPortrait = portrait;
        portrait = height() >= width();
        if (portrait !== oldPortrait) {
            document.body.classList.remove(VIEWPORT_CLASS_PREFIX + (portrait ? 'landscape' : 'portrait'));
            document.body.classList.add(VIEWPORT_CLASS_PREFIX + (portrait ? 'portrait' : 'landscape'));
        }

        active = null;
        for (var alias in VIEWPORTS)
            if (_check(VIEWPORTS[alias])) {
                active = alias;
                break;
            }

        if (old !== active) {
            if (old)
                document.body.classList.remove(VIEWPORT_CLASS_PREFIX + old);
            if (active)
                document.body.classList.add(VIEWPORT_CLASS_PREFIX + active);
            onChange.send(old, active);
        }
    }

    function _is(alias) {
        /*
         * Returns `true` if given `alias` is currently active. `alias` must be one of the viewport names defined
         * in settings.
         */
        if (alias in VIEWPORTS)
            return alias === active;
        throw new Error('Unknown viewport alias: ' + alias);
    }

    function is(aliases) {
        /*
         * Returns `true` if any of the aliases is currently active. `aliases` must be a string with any
         * viewport names defined in settings, separated by space.
         */
        aliases = aliases.split(' ');
        for (var i = 0; i < aliases.length; i++)
            if (_is(aliases[i]))
                return true;
        return false;
    }

    function get() {
        /*
         * Returns name of currently active viewport. May return `null` if none viewport is active.
         */
        return active;
    }

    function width() {
        /*
         * Returns window width, excluding toolbars and scrollbars.
         */
        return document.documentElement.clientWidth;
    }

    function height() {
        /*
         * Returns window height, excluding toolbars and scrollbars.
         */
        return document.documentElement.clientHeight;
    }

    function isPortrait() {
        return portrait;
    }

    function isLandscape() {
        return !portrait;
    }

    function enable() {
        _update();
        window.addEventListener('resize', _update);
    }

    function disable() {
        window.removeEventListener('resize', _update);
    }

    return {
        '_check': _check,
        '_update': _update,
        'width': width,
        'height': height,
        'is': is,
        'get': get,
        'isPortrait': isPortrait,
        'isLandscape': isLandscape,
        'onChange': onChange,
        'enable': enable,
        'disable': disable
    }
});
