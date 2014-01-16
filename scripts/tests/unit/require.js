
module('require.js', {
    'teardown': function() {
        define._reset();
    }
});

test('Global functions exists ', function() {
    strictEqual(typeof window.define, 'function', "`define` exists and it's a function");
    strictEqual(typeof window.require, 'function', "`require` exists and it's a function");
});

test('Several exception classes are defined', function() {
    ok(define.Error, '`define.Error` is defined');
    ok(define.ArgumentCountError, '`define.ArgumentCountError` is defined');
    ok(define.InvalidModuleNameError, '`define.InvalidModuleNameError` is defined');
    ok(define.InvalidModuleError, '`define.InvalidModuleError` is defined');
    ok(define.DuplicateModuleError, '`define.DuplicateModuleError` is defined');
    ok(require.ArgumentsError, '`require.ArgumentsError` is defined');
    ok(require.Error, '`require.Error` is defined');
});

test('Exceptions are instances of the builtin `Error` class', function() {
    ok(define.Error.prototype instanceof Error, '`define.Error`');
    ok(define.ArgumentCountError.prototype instanceof Error, '`define.ArgumentCountError`');
    ok(define.InvalidModuleNameError.prototype instanceof Error, '`define.InvalidModuleNameError`');
    ok(define.InvalidModuleError.prototype instanceof Error, '`define.InvalidModuleError`');
    ok(define.DuplicateModuleError.prototype instanceof Error, '`define.DuplicateModuleError`');
    ok(require.ArgumentsError.prototype instanceof Error, '`require.ArgumentsError`');
    ok(require.Error.prototype instanceof Error, '`require.Error`');
});

test('`define()` throws `define.DefineArgumentCountError`', function() {
    throws(define.bind(null, 1), define.ArgumentCountError, 'When argument count is less than 2');
    throws(define.bind(null, 1, 2, 3, 4), define.ArgumentCountError, 'When argument count is greater than 3');
});

test('`define()` throws `define.InvalidModuleNameError`', function() {
    var invalid = [{}, 1, [], function() {}, false, /string/];
    for (var i = 0; i < invalid.length; i++)
        throws(define.bind(null, invalid[i], {}), define.InvalidModuleNameError,
               "When module name is not a string, but it's " + typeof invalid[i]);
});

test('`define()` throws `define.InvalidModuleNameError`', function() {
    var invalidName = 'A!@#$%^&*()~[]{}\|;\':",.<>?'
    throws(define.bind(null, invalidName, {}), define.InvalidModuleNameError,
           'When module name contains characters that are not allowed');
});

test('`define()` throws `define.InvalidModuleNameError`', function() {
    var invalid = ['/', '/a', 'a/', 'a//b'];
    for (var i = 0; i < invalid.length; i++)
        throws(define.bind(null, invalid[i], {}), define.InvalidModuleNameError,
               'When slash is not in the middle of a module name or there is a double slash');
});

test('`define()` throws `define.DuplicateModuleError`', function() {
    define('duplicate_test', {});
    throws(define.bind(null, 'duplicate_test', {}), define.DuplicateModuleError,
           'When module with a same name is already defined');
});

test('`define()` throws `define.InvalidModuleError`', function() {
    var invalid1 = define.bind(null, 'undefined_test1', undefined);
    var invalid2 = define.bind(null, 'undefined_test2', function() {});
    throws(invalid1, define.InvalidModuleError, 'When module code is `undefined`');
    throws(invalid2, define.InvalidModuleError, 'When module code is a function returning `undefined`');
});

test('`define()` throws `define.Error`', function() {
    var invalid = define.bind(null, 'redundant_test', ['redundant'], {});
    throws(invalid, define.Error, 'When dependencies are specified but module is not a function');
});

test('`define()` throws `require.Error`', function() {
    var invalid = define.bind(null, 'not_defined_test', ['doesnt_exist'], function() { return {}; });
    throws(invalid, require.Error, 'When dependencies contain unknown module');
});

test('`define()` modules names can contain only lower case letters, digits, underscores and slashes', function() {
    var valid = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', '_', 'test/test'];
    for (var i = 0; i < valid.length; i++) {
        define(valid[i], {});
        ok(require(valid[i]), "'" + valid[i] + "' is OK");
    }
});

test('`define()` modules can be any simple objects', function() {
    var valid = {'object': {}, 'array': [], 'number': 1, 'string': 'string', 'bool': true};
    for (var name in valid)
        if (valid.hasOwnProperty(name)) {
            define(name, valid[name]);
            strictEqual(require(name), valid[name], typeof valid[name] + " is OK");
        }

    function testInternalFunction() {}

    function testFunctionModule() {
        return testInternalFunction;
    }

    define('function', testFunctionModule);
    strictEqual(require('function'), testInternalFunction, typeof testInternalFunction + " is OK");
});

test('`define()` modules can be functions returning objects', function() {
    var module = {'param': 99};
    var valid = function() { return module; };
    define('define2', valid);
    strictEqual(require('define2'), module, '`require()` is returning exactly the same instance that was defined');
});

test('`require()` throws `require.ArgumentsError`', function() {
    throws(require, require.ArgumentsError, 'When called without arguments');
    throws(require.bind(null, 'a', 'b'), require.ArgumentsError, 'When argument count is greater than 1');
});

test('`require()` throws `require.ArgumentsError`', function() {
    var invalid = [{}, [], 1, false, function() {}];
    for (var i = 0; i < invalid.length; i++)
        throws(require.bind(null, invalid[i]), require.ArgumentsError, 'When argument is ' + typeof invalid[i]);
});

test('`require()` throws `require.Error`', function() {
    throws(require.bind(null, 'not_exists'), require.Error, 'When requested module was not defined');
});


module("'settings' module", {
    'teardown': function() {
        define._reset();
    }
});

test("Is always available, even when not defined", function() {
    ok(require('settings'));
});

test('Can be defined as a plain object', function() {
    var settings = {'MY_SETTING': 99};
    define('settings', settings);
    strictEqual(require('_settings'), settings);
});

test('Can be defined as a function returning object', function() {
    var settings = {'MY_SETTING': 99};
    var settingsGenerator = function() { return settings; };
    define('settings', settingsGenerator);
    strictEqual(require('_settings'), settings);
});

test('Is always a function', function() {
    strictEqual(typeof require('settings'), 'function');
});

test('Throws `TypeError` when called with invalid argument count (< 1 or > 2)', function() {
    var settings = require('settings');
    throws(settings, TypeError);
    throws(settings.bind(null, 1, 2, 3), TypeError);
});

test('Returns fallback values when trying to get non-existent settings', function() {
    var settings = require('settings');
    strictEqual(settings('UNKNOWN_SETTING', 'FALLBACK_VALUE'), 'FALLBACK_VALUE');
    strictEqual(settings('UNKNOWN_SETTING', 123), 123);
});

test('Returns correct values for existing settings', function() {
    define('settings', {'MY_CUSTOM_SETTING': 99});
    var settings = require('settings');
    strictEqual(settings('MY_CUSTOM_SETTING'), 99);
});
