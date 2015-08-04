var config   = require('../config');
var changed  = require('gulp-changed');
var gulp     = require('gulp');

gulp.task('images:dev', function(){
    var dest = config.images.dest;

    return gulp.src(config.images.src)
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
});

gulp.task('images:production', function(){
    var dest = config.images.dest;

    return gulp.src(config.images.src)
        .pipe(gulp.dest(dest));
});
