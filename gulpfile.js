var gulp = require('gulp');
var swig = require('gulp-swig');
var map = require('map-stream');
var html = require('htmltidy');
var exec = require('child_process').exec;
var sizeOf = require('image-size');
var Table = require('cli-table');

var TEMPLATES_SRC = './templates/*.html';
var TEMPLATES_TO_BUILD = './templates/!(_)*.html';
var BUILD_SRC = './_build/**/*';

var COPY_TASKS = {
    'styles': ['./styles/**/*', './_build/styles/'],
    'scripts': [['./scripts/**/*', '!./scripts/nebula/test.js', '!./scripts/nebula/tests/**/*'], './_build/scripts/'],
    'fonts': ['./fonts/**/*', './_build/fonts/'],
    'images': ['./images/**/*', './_build/images/'],
    'media': ['./media/**/*', './_build/media/']
};

var TIDY_OPTIONS = {
    'indent': true,
    'indent-spaces': 4,
    'wrap': 0,
    'newline': 'LF',
    'vertical-space': true,
    'show-body-only': 'auto',
    'new-blocklevel-tags': 'main'
};

swig({'defaults': {'cache': false}});


function copyFilesTask(taskName, source, destination) {
    gulp.task(taskName, function() {
        return gulp.src(source).pipe(gulp.dest(destination));
    });
}


function tidy() {
    return map(function(file, callback) {
        html.tidy(file.contents, TIDY_OPTIONS, function(error, results) {
            file.contents = new Buffer(results);
            callback(null, file);
        });
    });
}


function stripBuild() {
    var path = require('path');
    return map(function(file, callback) {
        file.path = file.path.replace(file.cwd + path.sep + '_build' + path.sep, '');
        callback(null, file);
    });
}


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
                } catch(error) {}
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


gulp.task('templates', function() {
    return gulp.src(TEMPLATES_TO_BUILD).pipe(swig()).pipe(tidy()).pipe(gulp.dest('./_build/'));
});


for (var name in COPY_TASKS)
    copyFilesTask(name, COPY_TASKS[name][0], COPY_TASKS[name][1]);


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
        chars: {'top': '', 'top-mid': '', 'top-left': '', 'top-right': '', 'bottom': '', 'bottom-mid': '',
                'bottom-left': '', 'bottom-right': '', 'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
                'right': '', 'right-mid': '', 'middle': ' '},
    });

    for (var i = 0; i < memoryUsage.files.length; i++)
        table.push([memoryUsage.formatSize(memoryUsage.files[i].bytes), memoryUsage.files[i].path]);
    table.push([memoryUsage.formatSize(memoryUsage.value), 'Total']);
    console.log(table.toString());
});


gulp.task('server', ['templates', 'styles', 'scripts', 'fonts', 'images', 'media'], function() {
    gulp.watch(TEMPLATES_SRC, ['templates']);
    gulp.watch(COPY_TASKS.styles[0], ['styles']);
    gulp.watch(COPY_TASKS.scripts[0], ['scripts']);
    gulp.watch(COPY_TASKS.fonts[0], ['fonts']);
    gulp.watch(COPY_TASKS.images[0], ['images']);
    gulp.watch(COPY_TASKS.media[0], ['media']);
});


gulp.task('default', ['server']);
