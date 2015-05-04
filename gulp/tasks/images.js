var config   = require('../config');
var changed  = require('gulp-changed');
var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('images', function(){

    var dest = config.images.dest;

    return gulp.src(config.images.src)
        .pipe(changed(dest))
        // .pipe(imagemin())
        .pipe(gulp.dest(dest));

});
