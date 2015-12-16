var fs           = require('fs');
var path         = require('path');

var config       = require('../config');
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sassNpm      = require('sass-npm')();
var plumber      = require('gulp-plumber');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

var importer = function(url, file, done) {
    // look for modules installed through npm
    try {
        var newPath = require.resolve(url);
        fs.exists(newPath, function(exists) {
            if ( exists ) {
                return done({
                    file: newPath
                });
            }
            return done({
                file: url
            });
        });

    } catch(e) {
        return done({
            file: url
        });
    }
}

gulp.task('styles:dev', function(){
    return gulp.src(config.styles.src)
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({ importer: importer }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.styles.dest))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles:production', function(){
    return gulp.src(config.styles.src)
        .pipe(sass({
            outputStyle: 'compressed',
            importer: importer
        }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(gulp.dest(config.styles.dest));
});
