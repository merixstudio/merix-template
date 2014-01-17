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
define('nebula/viewport', ['settings', 'nebula/signal'], function(settings, Signal) {
    'use strict';

    var winAPI = window;  // Can be overriden, to allow unit testing.
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
            if (!winAPI.matchMedia)
                throw new Error('matchMedia is not available in this browser, please add a polyfill');
            return winAPI.matchMedia(specification).matches;
        }
        throw new Error('Invalid viewport specification: ' + specification);
    }

    function _updateOrientationClass(newPortrait) {
        if (newPortrait !== portrait) {
            var VIEWPORT_CLASS_PREFIX = settings('VIEWPORT_CLASS_PREFIX', 'viewport-');
            winAPI.document.body.classList.remove(VIEWPORT_CLASS_PREFIX + (newPortrait ? 'landscape' : 'portrait'));
            winAPI.document.body.classList.add(VIEWPORT_CLASS_PREFIX + (newPortrait ? 'portrait' : 'landscape'));
            portrait = newPortrait;
        }
    }

    function _updateViewportClass(newClass) {
        if (newClass !== active) {
            var VIEWPORT_CLASS_PREFIX = settings('VIEWPORT_CLASS_PREFIX', 'viewport-');
            if (active)
                winAPI.document.body.classList.remove(VIEWPORT_CLASS_PREFIX + active);
            if (newClass)
                winAPI.document.body.classList.add(VIEWPORT_CLASS_PREFIX + newClass);
            onChange.send(active, newClass);
            active = newClass;
        }
    }

    function _update() {
        var VIEWPORTS = settings('VIEWPORTS', {}), newClass;

        for (var alias in VIEWPORTS)
            if (_check(VIEWPORTS[alias])) {
                newClass = alias;
                break;
            }

        if (settings('VIEWPORT_ORIENTATION_CLASS', true))
            _updateOrientationClass(height() >= width());
        _updateViewportClass(newClass);
    }

    function _is(alias) {
        /*
         * Returns `true` if given `alias` is currently active. `alias` must be one of the viewport names defined
         * in settings.
         */
        var VIEWPORTS = settings('VIEWPORTS', {});
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

    function width(d) {
        /*
         * Returns window width, excluding toolbars and scrollbars.
         */
        return winAPI.document.documentElement.clientWidth;
    }

    function height() {
        /*
         * Returns window height, excluding toolbars and scrollbars.
         */
        return winAPI.document.documentElement.clientHeight;
    }

    function isPortrait() {
        return portrait;
    }

    function isLandscape() {
        return !portrait;
    }

    function enable() {
        _update();
        winAPI.addEventListener('resize', _update);
    }

    function disable() {
        winAPI.removeEventListener('resize', _update);
    }

    function _changeAPI(api) {
        // Unit test helper, allows to provide custom window and document implementations (mocks).
        winAPI = api;
    }

    return {
        '_changeAPI': _changeAPI,
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
