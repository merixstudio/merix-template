var config = require('../config');
var bs = require('browser-sync').create('pigie');
var gulp = require('gulp');

gulp.task('browserSync', function(cb) {
    bs.init({
        server: {
            baseDir: './_build'
        },
        port: config.serverport
    });
    cb();
});
