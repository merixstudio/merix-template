var config = require('../config');
var browserSync = require('browser-sync');
var gulp = require('gulp');

gulp.task('browserSync', function(){

    browserSync({
        server: {
            baseDir: './_build'
        },
        port: config.serverport
    });

});
