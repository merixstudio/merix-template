var config = require('../config');
var bs = require('browser-sync').create('pigie');
var gulp = require('gulp');
var argv = require('yargs').argv;

var browser = '';
var notify = true;
var open = false;

if (argv.chrome) {
    browser = 'chrome';
    open = true;
} else if (argv.firefox) {
    browser = 'firefox';
    open = true;
}

if (argv.nonotify) {
    notify = false;
}

if (argv.open) {
    open = true;
}

gulp.task('browserSync', function(cb) {
    bs.init({
        server: {
            baseDir: './_build'
        },
        port: config.serverport,
        browser: browser,
        notify: notify,
        open: open

    });
    cb();
});
