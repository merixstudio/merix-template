var config       = require('../config');
var gulp         = require('gulp');
var browserify   = require('browserify');
var watchify     = require('watchify');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var browserify   = require('browserify');
var bs           = require('browser-sync');

var buildDev = function(file) {
    var browserSync = bs.get('pigie');

    var bundler = browserify({
        entries: config.browserify.entries,
        cache: {},
        packageCache: {},
        fullPaths: false,
        debug: true
    });

    bundler.plugin(watchify, {
        ignoreWatch: ['**/node_modules/**', '_build/**']
    });

    bundler.on('update', function(){
       rebundle();
    });

    // bundler.on('log', gutil.log);

    function rebundle() {
        var stream = bundler.bundle();
        return stream.on('error', function(err) {
                gutil.log(err);
            })
            .pipe(source(config.browserify.bundleName))
            .pipe(gulp.dest(config.scripts.dest))
            .pipe(browserSync.stream());
    }

    return rebundle();
};

var buildProduction = function() {
    var bundler = browserify({
        entries: config.browserify.entries,
        cache: {},
        packageCache: {},
        fullPaths: false,
        debug: false
    });

    function rebundle() {
        var stream = bundler.bundle();
        return stream.on('error', function(err) {
                gutil.log(err);
            })
            .pipe(source(config.browserify.bundleName))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(config.scripts.dest));
    }

    return rebundle();
};

gulp.task('browserify:dev', function() {
    return buildDev();
});

gulp.task('browserify:production', function() {
    return buildProduction();
});
