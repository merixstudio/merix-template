var config      = require('../config');
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var nunjucksRender = require('gulp-nunjucks-render');

gulp.task('views:dev', function() {
    nunjucksRender.nunjucks.configure(['templates/'], {watch: true});
    return gulp.src(config.views.src)
        .pipe(nunjucksRender())
        .pipe(gulp.dest(config.views.dest))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('views:production', function() {
    nunjucksRender.nunjucks.configure(['templates/'], {watch: false});
    return gulp.src(config.views.src)
        .pipe(nunjucksRender())
        .pipe(gulp.dest(config.views.dest));
});
