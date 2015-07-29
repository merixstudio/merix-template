var config       = require('../config');
var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var nunjucks     = require('gulp-nunjucks');

gulp.task('views:dev', function() {
    return gulp.src(config.views.src)
        .pipe(nunjucks())
        .pipe(gulp.dest(config.views.dest))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('views:production', function() {
    return gulp.src(config.views.src)
        .pipe(nunjucks())
        .pipe(gulp.dest(config.views.dest));
});

