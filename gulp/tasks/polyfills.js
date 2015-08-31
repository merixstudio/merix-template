var config   = require('../config');
var changed  = require('gulp-changed');
var gulp     = require('gulp');

gulp.task('polyfills:dev', function(){
    var dest = config.polyfills.dest;

    return gulp.src(config.polyfills.src)
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
});

gulp.task('polyfills:production', function(){
    var dest = config.polyfills.dest;

    return gulp.src(config.polyfills.src)
        .pipe(gulp.dest(dest));
});
