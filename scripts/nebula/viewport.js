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
    var active = undefined, portrait = undefined;
    var onChange = new Signal();

    function _check(specification) {
        /*
         * Returns `true` if given viewport specification (may be a function, array or media query string)
         * is active.
         */
        if (typeof specification === 'function')
            return specification();
        else if (specification instanceof Array && specification.length === 2 &&
                 typeof specification[0] === 'number' && typeof specification[1] === 'number' &&
                 specification[0] <= specification[1])
            return specification[0] <= width() && width() <= specification[1];
        else if (typeof specification === 'string') {
            if (!winAPI.matchMedia)
                throw new Error('matchMedia is not available in this browser, please add a polyfill');
            return winAPI.matchMedia(specification).matches;
        }
        throw new Error('Invalid viewport specification: ' + specification);
    }

    function _changeOrientation(newPortrait) {
        if (newPortrait !== portrait) {
            if (settings('VIEWPORT_ORIENTATION_CLASS', true)) {
                var VIEWPORT_CLASS_PREFIX = settings('VIEWPORT_CLASS_PREFIX', 'viewport-');
                winAPI.document.body.classList.remove(VIEWPORT_CLASS_PREFIX + (portrait ? 'portrait' : 'landscape'));
                winAPI.document.body.classList.add(VIEWPORT_CLASS_PREFIX + (newPortrait ? 'portrait' : 'landscape'));
            }
            portrait = newPortrait;
        }
    }

    function _changeViewport(newClass) {
        var previousClass = active || null;
        if (newClass !== active) {
            var VIEWPORT_CLASS_PREFIX = settings('VIEWPORT_CLASS_PREFIX', 'viewport-');
            if (active)
                winAPI.document.body.classList.remove(VIEWPORT_CLASS_PREFIX + active);
            if (newClass)
                winAPI.document.body.classList.add(VIEWPORT_CLASS_PREFIX + newClass);
            active = newClass;
            onChange.send(previousClass, active);
        }
    }

    function _update() {
        var VIEWPORTS = settings('VIEWPORTS', {}), newClass = null;

        for (var alias in VIEWPORTS)
            if (_check(VIEWPORTS[alias])) {
                newClass = alias;
                break;
            }

        _changeViewport(newClass);
        _changeOrientation(height() >= width());
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
        if (!isEnabled())
            throw new Error('You must call `viewport.enable()` first to use `viewport.is()`');
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
        if (!isEnabled())
            throw new Error('You must call `viewport.enable()` first to use `viewport.get()`');
        /*
         * Returns name of currently active viewport. May return `null` if none viewport is active.
         */
        return active;
    }

    function width() {
        /*
         * Returns window width, excluding toolbars and scrollbars.
         */
        return winAPI.innerWidth || winAPI.document.documentElement.clientWidth;
    }

    function height() {
        /*
         * Returns window height, excluding toolbars and scrollbars.
         */
        return winAPI.innerHeight || winAPI.document.documentElement.clientHeight;
    }

    function isPortrait() {
        if (!isEnabled())
            throw new Error('You must call `viewport.enable()` first to use `viewport.isPortrait()`');
        return portrait;
    }

    function isLandscape() {
        if (!isEnabled())
            throw new Error('You must call `viewport.enable()` first to use `viewport.isLandscape()`');
        return !portrait;
    }

    function enable(api) {
        if (api)
            winAPI = api;
        _update();
        winAPI.addEventListener('resize', _update);
    }

    function disable() {
        winAPI.removeEventListener('resize', _update);
        active = portrait = undefined;
    }

    function isEnabled() {
        return typeof active !== 'undefined';
    }

    return {
        '_changeOrientation': _changeOrientation,
        '_changeViewport': _changeViewport,
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
        'disable': disable,
        'isEnabled': isEnabled
    }
});
