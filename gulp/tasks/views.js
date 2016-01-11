var config          = require('../config');
var gulp            = require('gulp');
var bs              = require('browser-sync');
var nunjucksRender  = require('gulp-nunjucks-render');

gulp.task('views:dev', function() {
    var browserSync = bs.get('pigie');

    nunjucksRender.nunjucks.configure(['templates/'], {watch: true});
    return gulp.src(config.views.src)
        .pipe(nunjucksRender())
        .pipe(gulp.dest(config.views.dest))
        .pipe(browserSync.stream());
});

gulp.task('views:production', function() {
    nunjucksRender.nunjucks.configure(['templates/'], {watch: false});
    return gulp.src(config.views.src)
        .pipe(nunjucksRender())
        .pipe(gulp.dest(config.views.dest));
});
