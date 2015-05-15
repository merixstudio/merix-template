var config       = require('../config');
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var gulpif       = require('gulp-if');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('styles:dev', function(){
    return gulp.src(config.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));
});

gulp.task('styles:production', function(){
    return gulp.src(config.styles.src)
        .pipe(sass({
                outputStyle: 'compressed'
        }))
        .pipe(gulp.dest(config.styles.dest));
});
