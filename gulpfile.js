var gulp = require('gulp');
var swig = require('gulp-swig');
var map = require('map-stream');
var html = require('htmltidy');
var exec = require('child_process').exec;
var sizeOf = require('image-size');
var Table = require('cli-table');

var tidyOptions = {
    'indent': true,
    'indent-spaces': 4,
    'wrap': 0,
    'newline': 'LF',
    'vertical-space': true,
    'show-body-only': 'auto',
    'new-blocklevel-tags': 'main'
};

var tidy = function() {
    return map(function(file, callback) {
        html.tidy(file.contents, tidyOptions, function(error, results) {
            file.contents = new Buffer(results);
            callback(null, file);
        });
    });
};

var stripBuild = function() {
    var path = require('path');
    return map(function(file, callback) {
        file.path = file.path.replace(file.cwd + path.sep + '_build' + path.sep, '');
        callback(null, file);
    });
};

var memoryUsage = {
    'value': 0,
    'files': [],
    'count': function() {
        return map(function(file, callback) {
            if (!file.isDirectory()) {
                try {
                    var size = sizeOf(file.path);
                    var bytes = size.width * size.height * 4;
                    memoryUsage.value += bytes;
                    memoryUsage.files.push({'path': file.path, 'bytes': bytes});
                } catch(error) {

                }
            }
            callback(null, file);
        });
    },
    'sizeCompare': function(a, b) {
        return a.bytes - b.bytes;
    },
    'formatSize': function(number) {
        return (number / 1024).toFixed(2);
    }
};


swig({'defaults': {'cache': false}});

var TEMPLATES_SRC = './templates/*.html';
var TEMPLATES_TO_BUILD = './templates/!(_)*.html';
var STYLES_SRC = './styles/**/*';
var SCRIPTS_SRC = ['./scripts/**/*', '!./scripts/nebula/test.js', '!./scripts/nebula/tests/**/*'];
var FONTS_SRC = './fonts/**/*';
var IMAGES_SRC = './images/**/*';
var MEDIA_SRC = './media/**/*';
var BUILD_SRC = './_build/**/*';

gulp.task('templates', function() {
    return gulp.src(TEMPLATES_TO_BUILD).pipe(swig()).pipe(tidy()).pipe(gulp.dest('./_build/'));
});

gulp.task('styles', function() {
    return gulp.src(STYLES_SRC).pipe(gulp.dest('./_build/styles/'));
});

gulp.task('scripts', function() {
    return gulp.src(SCRIPTS_SRC).pipe(gulp.dest('./_build/scripts/'));
});

gulp.task('fonts', function() {
    return gulp.src(FONTS_SRC).pipe(gulp.dest('./_build/fonts/'));
});

gulp.task('images', function() {
    return gulp.src(IMAGES_SRC).pipe(gulp.dest('./_build/images/'));
});

gulp.task('media', function() {
    return gulp.src(MEDIA_SRC).pipe(gulp.dest('./_build/media/'));
});

gulp.task('zip', ['templates', 'styles', 'scripts', 'fonts', 'images', 'media'], function() {
    exec('cd _build && 7z a ../build.zip *');
});

gulp.task('memory_usage_count', [], function() {
    memoryUsage.value = 0;
    return gulp.src(IMAGES_SRC).pipe(memoryUsage.count());
});

gulp.task('memory_usage', ['memory_usage_count'], function() {
    memoryUsage.files.sort(memoryUsage.sizeCompare);

    var table = new Table({
        head: ['KB', 'File'],
        colAligns: ['right', 'left'],
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
    });

    for (var i = 0; i < memoryUsage.files.length; i++)
        table.push([memoryUsage.formatSize(memoryUsage.files[i].bytes), memoryUsage.files[i].path]);
    table.push([memoryUsage.formatSize(memoryUsage.value), 'Total']);
    console.log(table.toString());
});

gulp.task('server', ['templates', 'styles', 'scripts', 'fonts', 'images', 'media'], function() {
    gulp.watch(TEMPLATES_SRC, ['templates']);
    gulp.watch(STYLES_SRC, ['styles']);
    gulp.watch(SCRIPTS_SRC, ['scripts']);
    gulp.watch(FONTS_SRC, ['fonts']);
    gulp.watch(IMAGES_SRC, ['images']);
    gulp.watch(MEDIA_SRC, ['media']);
});

gulp.task('default', ['server']);
