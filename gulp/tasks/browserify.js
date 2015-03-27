'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var browserify   = require('browserify');
var watchify     = require('watchify');
var gutil        = require('gulp-util');
var source       = require('vinyl-source-stream');
var watchify     = require('watchify');
var browserify   = require('browserify');
var browserSync  = require('browser-sync');

function build(file){

    var bundler = browserify({
        entries: config.browserify.entries,
        cache: {},
        packageCache: {},
        fullPaths: true
    }, watchify.args)

    bundler = watchify(bundler);
    bundler.on('update', function(){
       rebundle();
    });

    function rebundle(){
        var stream = bundler.bundle();
        return stream.on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(file))
            .pipe(gulp.dest(config.scripts.dest))
            .pipe(browserSync.reload({stream: true, once: true }));
    }

    return rebundle();

}

gulp.task('browserify', function(){

    return build('main.js');

});
