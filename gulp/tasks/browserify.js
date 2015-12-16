var config       = require('../config');
var gulp         = require('gulp');
var browserify   = require('browserify');
var watchify     = require('watchify');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var browserify   = require('browserify');
var browserSync  = require('browser-sync');

var buildDev = function (file) {
    var bundler = browserify({
        entries: config.browserify.entries,
        cache: {},
        packageCache: {},
        fullPaths: false,
        debug: true
    }, watchify.args);

    bundler = watchify(bundler);

    bundler.on('update', function(){
       rebundle();
    });

    function rebundle() {
        var stream = bundler.bundle();
        return stream.on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(file))
            .pipe(gulp.dest(config.scripts.dest))
            .pipe(browserSync.reload({stream: true, once: true }));
    }

    return rebundle();
};

var buildProduction = function (file) {
    var bundler = browserify({
        entries: config.browserify.entries,
        cache: {},
        packageCache: {},
        fullPaths: false,
        debug: false
    }, watchify.args);

    function rebundle() {
        var stream = bundler.bundle();
        return stream.on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(file))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(config.scripts.dest));
    }

    return rebundle();
};

gulp.task('browserify:dev', function() {
    return buildDev('main.js');
});

gulp.task('browserify:production', function() {
    return buildProduction('main.js');
});
