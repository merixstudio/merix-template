var config   = require('../config');
var changed  = require('gulp-changed');
var gulp     = require('gulp');

gulp.task('media:dev', function(){
    var dest = config.medias.dest;

    return gulp.src(config.medias.src)
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
});

gulp.task('media:production', function(){
    var dest = config.medias.dest;

    return gulp.src(config.medias.src)
        .pipe(gulp.dest(dest));
});
