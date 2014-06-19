/*
 * Copyright (c) 2009 Borgar Þorsteinsson, http://borgar.net/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * Source: https://github.com/borgar/String.format
 */
describe('format.js', function() {
    var format = require('nebula/format');

    function check(template, args, output) {
        // Just a shortcut to simplify the tests below.
        expect(format(template, args)).toBe(output);
    }

    it('works with some basic arguments', function() {
        check('%.1d', [1], '1');
        check('%.100d', [1], '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
        check('%#.117x', [1], '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
        check('%#.118x', [1], '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
        check('%f', [1.0], '1.000000');

        check('you have %d items', 4, 'you have 4 items');
        check('%s has %d items', ['harvey', 5], 'harvey has 5 items');

        check('%*s has %d items', ['harvey', 3, 5], 'harvey has 5 items');
        check('%% %*s has %d items', ['harvey', 3, 5], '% harvey has 5 items');
        check('%%(%s)s', ['harvey'], '%(harvey)s');

        check('%x', 10, 'a');
        check('%x', 100000000000, '174876e800');
        check('%o', 10, '12');
        check('%o', 100000000000, '1351035564000');
        check('%d', 10, '10');
        check('%d', 100000000000, '100000000000');

        check('%x', 0x42, '42');
        check('%x', -0x42, '-42');
        check('%x', parseFloat(0x42), '42');

        check('%o', 042, '42');
        check('%o', -042, '-42');
        check('%o', parseFloat(042), '42');

        check('%g', 1.1, '1.1');
        check('%#g', 1.1, '1.10000');
    });

    it('formats large integers', function() {
        var big = 1234567890;
        check('%d', big, '1234567890');
        check('%d', -big, '-1234567890');
        check('%5d', -big, '-1234567890');
        check('%11d', -big, '-1234567890');
        check('%12d', -big, ' -1234567890');
        check('%-12d', -big, '-1234567890 ');
        check('%012d', -big, '-01234567890');
        check('%-012d', -big, '-1234567890 ');
        check('%014d', -big, '-0001234567890');
        check('%014d', big, '00001234567890');
        check('%0+14d', big, '+0001234567890');
        check('%+14d', big, '   +1234567890');
        check('%14d', big, '    1234567890');
        check('%.2d', big, '1234567890');
        check('%.10d', big, '1234567890');
        check('%.11d', big, '01234567890');
        check('%12.11d', big, ' 01234567890');
    });

    it('formats hexadecimal numbers', function() {
        var big = 0x34567890abc;  // 21 hex digits
        check('%x', big, '34567890abc');
        check('%x', -big, '-34567890abc');
        check('%5x', -big, '-34567890abc');
        check('%12x', -big, '-34567890abc');
        check('%13x', -big, ' -34567890abc');
        check('%-13x', -big, '-34567890abc ');
        check('%013x', -big, '-034567890abc');
        check('%-013x', -big, '-34567890abc ');
        check('%015x', -big, '-00034567890abc');
        check('%015x', big, '000034567890abc');
        check('%0+15x', big, '+00034567890abc');
        check('%+15x', big, '   +34567890abc');
        check('%15x', big, '    34567890abc');
        check('%.2x', big, '34567890abc');
        check('%.11x', big, '34567890abc');
        check('%.12x', big, '034567890abc');
        check('%13.12x', big, ' 034567890abc');
        check('%-13.12x', big, '034567890abc ');
        check('%X', big, '34567890ABC');
        check('%#X', big, '0X34567890ABC');
        check('%#x', big, '0x34567890abc');
        check('%#x', -big, '-0x34567890abc');
        check('%#.13x', -big, '-0x0034567890abc');
        check('%#+.13x', big, '+0x0034567890abc');
        check('%# .13x', big, ' 0x0034567890abc');
        check('%#+.13X', big, '+0X0034567890ABC');
        check('%#-+.13X', big, '+0X0034567890ABC');
        check('%#-+16.13X', big, '+0X0034567890ABC');
        check('%#-+17.13X', big, '+0X0034567890ABC ');
        check('%#+17.13X', big, ' +0X0034567890ABC');
        check('%#+017.13X', big, '+0X00034567890ABC');
        check('%#+17.13X', big, ' +0X0034567890ABC');
    });

    it('formats octal numbers', function() {
        var big = 01234567012345670;
        check('%o', big, '1234567012345670');
        check('%o', -big, '-1234567012345670');
        check('%5o', -big, '-1234567012345670');
        check('%17o', -big, '-1234567012345670');
        check('%18o', -big, ' -1234567012345670');
        check('%-18o', -big, '-1234567012345670 ');
        check('%018o', -big, '-01234567012345670');
        check('%-018o', -big, '-1234567012345670 ');
        check('%020o', -big, '-0001234567012345670');
        check('%020o', big, '00001234567012345670');
        check('%0+20o', big, '+0001234567012345670');
        check('%+20o', big, '   +1234567012345670');
        check('%20o', big, '    1234567012345670');
        check('%.2o', big, '1234567012345670');
        check('%.16o', big, '1234567012345670');
        check('%.17o', big, '01234567012345670');
        check('%18.17o', big, ' 01234567012345670');
        check('%-18.17o', big, '01234567012345670 ');
        check('%o', big, '1234567012345670');
        check('%#o', big, '01234567012345670');
        check('%#o', -big, '-01234567012345670');
        check('%#.18o', -big, '-001234567012345670');
        check('%#+.18o', big, '+001234567012345670');
        check('%# .18o', big, ' 001234567012345670');
        check('%#+.18o', big, '+001234567012345670');
        check('%#-+.18o', big, '+001234567012345670');
        check('%#-+21.18o', big, '+001234567012345670  ');
        check('%#+21.18o', big, '  +001234567012345670');
        // next one gets one leading zero from precision
        check('%.17o', big, '01234567012345670');
        // base marker shouldn't change that, since '0' is redundant
        check('%#.17o', big, '01234567012345670');
        // but reduce precision, and base marker should add a zero
        check('%#.16o', big, '01234567012345670');
        // one leading zero from precision, and another from '0' flag & width
        check('%018.17o', big, '001234567012345670');
        // base marker shouldn't change that
        check('%0#18.17o', big, '001234567012345670');
    });

    it('formats small integers', function() {
        check('%d', 42, '42');
        check('%d', -42, '-42');
        check('%d', 42.0, '42');
        check('%#x', 1, '0x1');
        check('%#X', 1, '0X1');
        check('%#x', 1.0, '0x1');
        check('%#o', 1, '01');
        check('%#o', 0, '0');
        check('%o', 0, '0');
        check('%d', 0, '0');
        check('%#x', 0, '0x0');
        check('%#X', 0, '0X0');
    });

    it('formats exponentials', function() {
        check('%e', 1, '1.000000e+00');
        check('%.e', 1, '1e+00');
        check('%.5e', 1, '1.00000e+00');
        check('%.5e', 1.125, '1.12500e+00');
        check('%12.5e', 1.125678, ' 1.12568e+00');
        check('%-12.5e', 1.125678, '1.12568e+00 ');
        check('%#-12.0e', 1.125678, '1.e+00      ');
        check('%0#-12.0e', 1.12345, '1.e+00      ');
        check('%0#12.0e', 1.12345, '0000001.e+00');
    });

    it('formats floating point', function() {
        check('%f', 1.12345, '1.123450');
        check('%.4f', 1.12345, '1.1235');
        check('%.14f', 1.12345, '1.12345000000000');
        check('%20.14f', 1.12345, '    1.12345000000000');
        check('%020.14f', 1.12345, '00001.12345000000000');
        check('% 020.14f', 1.12345, ' 0001.12345000000000');
        check('% -020.14f', 1.12345, ' 1.12345000000000   ');
        check('% -#020.f', 1.12345, ' 1.                 ');
        check('% +#020.f', 1.12345, '+000000000000000001.');
        check('%020.14f', -1.12345, '-0001.12345000000000');
    });

    it('formats general (type)', function() {
        check('%g', 1.12345, '1.12345');
        check('%.4g', 1.12345, '1.123');
        check('%.14g', 1.12345, '1.12345');
        check('%20.14g', 1.12345, '             1.12345');
        check('%020.14g', 1.12345, '00000000000001.12345');
        check('% 020.14g', 1.12345, ' 0000000000001.12345');
        check('% -020.14g', 1.12345, ' 1.12345            ');
        check('% -#020.g', 1.12345, ' 1.                 ');
        check('% +#020.g', 1.12345, '+000000000000000001.');
        check('%020.14g', -1.12345, '-0000000000001.12345');
    });

    it('formats characters', function() {
        check('%c%c%c', [1, 2, 3], '\x01\x02\x03');
        check('%c%c%c', [1, 'r', 3], '\x01r\x03');
        check('%c%c%c', [1, 'r', 'f'], '\x01rf');
    });

    it('formats object representations', function () {
        var r = {'afoo': 23, 'sub': {'as': 1, '4': 5}, 'arr': [1, 2, 3, 4]};
        check('%r', r, "{'afoo': 23, 'arr': [1, 2, 3, 4], 'sub': {'4': 5, 'as': 1}}");
        check('%r', 'ffoo', "'ffoo'");
    });

    it('formats strings', function() {
        check('%s', 'teststring', 'teststring');
        check('%.5s', 'teststring', 'tests');
        check('%5.5s', 'teststring', 'tests');
        check('%6.5s', 'teststring', ' tests');
        check('%-16.5s', 'teststring', 'tests           ');
        check('%-16.s', 'teststring', '                ');
        check('%-16s', 'teststring', 'teststring      ');
        check('%#-16s', 'teststring', 'teststring      ');
        check('%0-16s', 'teststring', 'teststring      ');
        check('%0+16s', 'teststring', '      teststring');
        check('%016s', 'teststring', '      teststring');
    });
});
