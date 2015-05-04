var config   = require('../config');
var changed  = require('gulp-changed');
var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('medias', function(){

    var dest = config.medias.dest;

    return gulp.src(config.medias.src)
        .pipe(changed(dest))
        // .pipe(imagemin())
        .pipe(gulp.dest(dest));

});
