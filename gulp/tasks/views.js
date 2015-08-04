var config      = require('../config');
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var swig        = require('gulp-swig');

gulp.task('views:dev', function() {
    return gulp.src(config.views.src)
        .pipe(swig({ defaults: { cache: false } }))
        .pipe(gulp.dest(config.views.dest))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('views:production', function() {
    return gulp.src(config.views.src)
        .pipe(swig({ defaults: { cache: false } }))
        .pipe(gulp.dest(config.views.dest));
});

