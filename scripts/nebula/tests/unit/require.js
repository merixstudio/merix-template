describe('require.js', function() {

    var originalModules = define._init();

    beforeEach(function() {
        define._init();
    });

    afterEach(function() {
        define._init(originalModules);
    });

    describe('`define()`', function() {
        describe('throws `define.DefineArgumentCountError`', function() {
            it('when argument count is less than 2', function() {
                expect(define.bind(null, 1)).toThrowError(define.ArgumentCountError);
            });
            it('when argument count is greater than 3', function() {
                expect(define.bind(null, 1, 2, 3, 4)).toThrowError(define.ArgumentCountError);
            });
        });

        describe('throws `define.InvalidModuleNameError`', function() {
            it('when module name is not a string', function() {
                var invalid = [{}, 1, [], function() {}, false, /string/];
                for (var i = 0; i < invalid.length; i++)
                    expect(define.bind(null, invalid[i], {})).toThrowError(define.InvalidModuleNameError);
            });

            it('when module name contains characters that are not allowed', function() {
                var invalidName = 'A!@#$%^&*()~[]{}\|;\':",.<>?';
                expect(define.bind(null, invalidName, {})).toThrowError(define.InvalidModuleNameError);
            });

            it('when slash is not in the middle of a module name or there is a double slash', function() {
                var invalid = ['/', '/a', 'a/', 'a//b'];
                for (var i = 0; i < invalid.length; i++)
                    expect(define.bind(null, invalid[i], {})).toThrowError(define.InvalidModuleNameError);
            });
        });

        describe('throws `define.DuplicateModuleError`', function() {
            it('when module with a same name is already defined', function() {
                define('duplicate_test', {});
                expect(define.bind(null, 'duplicate_test', {})).toThrowError(define.DuplicateModuleError);
            });
        });

        describe('throws `define.InvalidModuleError`', function() {
            it('when module code is `undefined`', function() {
                var invalid1 = define.bind(null, 'undefined_test', undefined);
                expect(invalid1).toThrowError(define.InvalidModuleError);
            });
        });

        describe('throws `define.Error`', function() {
            it('when dependencies are specified but module is not a function', function() {
                var invalid = define.bind(null, 'redundant_test', ['redundant'], {});
                expect(invalid).toThrowError(define.Error);
            });
        });

        describe('throws `require.Error`', function() {
            it('when dependencies contain an unknown module', function() {
                function invalid() {
                    define('not_defined_test', ['doesnt_exist'], function() {
                        return {};
                    });
                };
                expect(invalid).toThrow();
            });
        });

        it('modules names can contain only lower case letters, digits, underscores and slashes', function() {
            var valid = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', '_', 'test/test'];
            for (var i = 0; i < valid.length; i++)
                expect(function() { define(valid[i], {}); }).not.toThrow();
        });

        it('modules can be any simple objects', function() {
            var valid = {'object': {}, 'array': [], 'number': 1, 'string': 'string', 'bool': true};
            for (var name in valid)
                if (valid.hasOwnProperty(name)) {
                    define(name, valid[name]);
                    expect(require(name)).toBe(valid[name]);
                }
        });

        it('modules can be constructors', function() {
            function testInternalFunction() {}
            function testFunctionModule() {
                this.testInternalFunction = testInternalFunction;
            }

            define('function', testFunctionModule);
            expect(require('function') instanceof testFunctionModule).toBe(true);
            var _testInternalFunction = require('function.testInternalFunction');
            expect(_testInternalFunction === testInternalFunction).toBe(true);
        });

        it('modules can be functions returning objects', function() {
            var module = {'param': 99};
            var valid = function() { return module; };
            define('define2', valid);
            expect(require('define2')).toBe(module);
        });

        it('modules can have dependencies', function() {
            var dependency = {};
            var dependencyWithMember = {'python': 'Rocks!'};
            define('dependency', dependency);
            define('dependency_with_member', dependencyWithMember);
            expect(define.bind(null, 'define99', ['dependency', 'dependency_with_member'], function(_dependency, _dependencyWithMember) {
                expect(_dependency).toBe(dependency);
                expect(_dependencyWithMember).toBe(dependencyWithMember);
                return {};
            })).not.toThrow();
        });

        it('modules can have aliases', function() {
            define('settings', {'ALIASES': {'INVALID-NAME': 'valid_name'}});
            define('INVALID-NAME', {'spam': 'eggs'});
            var module = require('valid_name');
            expect(module.spam).toBe('eggs');
        });
    });

    describe('`require()`', function() {
        describe('throws `require.ArgumentsError`', function() {
            it('when called without arguments', function() {
                expect(require).toThrowError(require.ArgumentsError);
            });
            it('when argument count is greater than 1', function() {
                expect(require.bind(null, 'a', 'b')).toThrowError(require.ArgumentsError);
            });
        });

        describe('throws `require.ArgumentsError`', function() {
            it('when module name is not a string', function() {
                var invalid = [{}, [], 1, false, function() {}];
                for (var i = 0; i < invalid.length; i++)
                    expect(require.bind(null, invalid[i])).toThrowError(require.ArgumentsError);
            });
        });

        describe('throws `require.Error`', function() {
            it('when requested module was not defined', function() {
                expect(require.bind(null, 'not_exists')).toThrowError(require.Error);
            });
            it("when module doesn't have specified attribute", function() {
                var module = {'foo': 'bar'};
                define('spam', module);
                expect(require.bind(null, 'spam.unknown')).toThrowError(require.Error);
            });
        });

        it('retrieves a previously defined module', function() {
            var module = {'foo': 'bar'};
            var valid = function() { return module; };
            define('define3', valid);
            expect(require('define3')).toBe(module);
        });

        it('retrieves member of a module', function() {
            var module = {'foo': {}};
            var valid = function() { return module; };
            define('define4', valid);
            expect(require('define4.foo')).toBe(module.foo);
        });
    });

    describe("'settings' module", function() {
        var winAPIOK = {
            'JSON': JSON,
            'document': {
                'querySelectorAll': function() {
                    return [{'innerHTML': '{"DEBUG": true}'}]
                }
            }
        };
        var winAPIMultiple = {
            'JSON': JSON,
            'document': {
                'querySelectorAll': function() {
                    return [{'innerHTML': '{"A": true}'}, {'innerHTML': '{"B": true}'}]
                }
            }
        };
        var winAPIInvalid = {
            'JSON': JSON,
            'document': {
                'querySelectorAll': function() {
                    return [{'innerHTML': "It's not a JSON!"}]
                }
            }
        };

        it("is always available, even when not defined", function() {
            expect(require.bind(null, 'settings')).not.toThrow();
        });
        it('can be defined as a plain object', function() {
            define('settings', {'MY_PLAIN_SETTING': 99});
            var settings = require('settings');
            expect(settings('MY_PLAIN_SETTING')).toBe(99);
        });
        it('can be defined as a function returning object', function() {
            var settingsGenerator = function() { return {'MY_FUNC_SETTING': 88}; };
            define('settings', settingsGenerator);
            var settings = require('settings');
            expect(settings('MY_FUNC_SETTING')).toBe(88);
        });
        it('is always a function', function() {
            expect(typeof require('settings')).toBe('function');
        });
        it('throws `TypeError` when called with invalid argument count (< 1 or > 2)', function() {
            var settings = require('settings');
            expect(settings).toThrowError(TypeError);
            expect(settings.bind(null, 1, 2, 3)).toThrowError(TypeError);
        });
        it('returns fallback values when trying to get non-existent settings', function() {
            var settings = require('settings');
            expect(settings('UNKNOWN_SETTING', 'FALLBACK_VALUE')).toBe('FALLBACK_VALUE');
            expect(settings('UNKNOWN_SETTING', 123)).toBe(123);
        });
        it('returns correct values for existing settings', function() {
            define('settings', {'MY_CUSTOM_SETTING': 99});
            var settings = require('settings');
            expect(settings('MY_CUSTOM_SETTING')).toBe(99);
        });
        it('can be defined in HTML as a `<script>` tag', function() {
            define._init(null, winAPIOK);
            var settings = require('settings');
            expect(settings('DEBUG')).toBe(true);
        });
        it('treats HTML settings as more important than JS settings', function() {
            define._init(null, winAPIOK);
            define('settings', {'DEBUG': 'ignored', 'OTHER': 'b'});
            var settings = require('settings');
            expect(settings('DEBUG')).toBe(true);  // From HTML
            expect(settings('OTHER')).toBe('b');  // From JavaScript object
        });
        it('allows only one `<script>` tag and throws an exception when there is more', function() {
            expect(define._init.bind(null, null, winAPIMultiple)).toThrowError(define.Error);
        });
        it("throws `define.Error` when HTML settings doesn't contains valid JSON", function() {
            expect(define._init.bind(null, null, winAPIInvalid)).toThrowError(define.Error);
        });
    });

    define._init(originalModules);
});
