var config       = require('../config');
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var browserSync  = require('browser-sync');
var swig         = require('gulp-swig');

gulp.task('views', function(){

    return gulp.src(config.views.src)
        .pipe(swig({defaults: {cache: false}}))
        .pipe(gulp.dest(config.views.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));

});
