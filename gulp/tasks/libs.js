var config   = require('../config');
var changed  = require('gulp-changed');
var gulp     = require('gulp');

gulp.task('libs:dev', function(){
    var dest = config.libs.dest;

    return gulp.src(config.libs.src)
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
});

gulp.task('libs:production', function(){
    var dest = config.libs.dest;

    return gulp.src(config.libs.src)
        .pipe(gulp.dest(dest));
});
