
function define(moduleName, dependencies, moduleCode) {
    if (moduleName in define.modules)
        throw new ReferenceError("module '" + moduleName + "' is already defined");
    if (typeof dependencies !== 'function' && typeof moduleCode !== 'function')
        throw new TypeError("module '" + moduleName + "' is not a function");

    var args = [];
    if (typeof dependencies === 'function')
        moduleCode = dependencies;
    else
        for (var i = 0; i < dependencies.length; i++)
            args.push(require(dependencies[i]));

    moduleCode = moduleCode.apply(this, args);

    if (typeof moduleCode === 'undefined')
        throw new TypeError("module '" + moduleName + "' doesn't export any definitions");

    if (moduleName === 'jquery')
        jQuery.noConflict(true);

    define.modules[moduleName] = moduleCode;
}

function require(moduleName) {
    if (moduleName in define.modules)
        return define.modules[moduleName];
    throw new ReferenceError("no module named '" + moduleName + "'");
}

require.jQueryPlugins = function() {
    var jQuery = require('jquery');
    var missing = [];

    for (var i = 0; i < arguments.length; i++)
        if (typeof jQuery.fn[arguments[i]] === 'undefined' && typeof jQuery[arguments[i]] === 'undefined')
            missing.push(arguments[i]);

    if (missing.length)
        throw new ReferenceError("no jQuery plugins named '" + missing.join("', '") + "'");
};

define.amd = {'jQuery': true};
define.modules = {};
