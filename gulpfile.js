var gulp = require('gulp');
var concat = require('gulp-concat');
var swig = require('gulp-swig');
var map = require('map-stream');
var html = require('htmltidy');
var prefix = require('gulp-autoprefixer');
var exec = require('child_process').exec;
var sizeOf = require('image-size');
var Table = require('cli-table');
var argv = require('yargs').argv;
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

var TEMPLATES_SRC = './templates/**/*';
var TEMPLATES_TO_BUILD = './templates/**/!(_)*.html';
var STYLES_SRC = './styles/**/*';
var STYLES_TO_BUILD = './_build/styles/';
var BUILD_SRC = './_build/**/*';

var COPY_TASKS = {
    'scripts': [['./scripts/**/*', '!./scripts/nebula/test.js', '!./scripts/nebula/tests/**/*'], './_build/scripts/'],
    'fonts': ['./fonts/**/*', './_build/fonts/'],
    'images': ['./images/**/*', './_build/images/'],
    'media': ['./media/**/*', './_build/media/'],
    'templatesToCopy': [['./templates/**/!(_)*.html', '!./templates/**/readme.txt'], './_build']
};

var MEMORY_USAGE_PATHS = ['./images/**/*', './media/**/*'];

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


function toConsole() {
    return map(function(file, callback) {
        console.log(file.contents.toString());
        callback(null, file);
    });
}


gulp.task('templates', function() {
    return gulp.src(TEMPLATES_TO_BUILD).pipe(swig()).pipe(tidy()).pipe(gulp.dest('./_build/'));
});

gulp.task('styles', function() {
    return gulp.src(STYLES_SRC).pipe(prefix()).pipe(gulp.dest(STYLES_TO_BUILD));
});


for (var name in COPY_TASKS)
    copyFilesTask(name, COPY_TASKS[name][0], COPY_TASKS[name][1]);


gulp.task('zip', ['templates', 'ajax', 'styles', 'scripts', 'fonts', 'images', 'media'], function() {
    exec('cd _build && 7z a ../build.zip *');
});


gulp.task('memory_usage_count', [], function() {
    memoryUsage.value = 0;
    return gulp.src(MEMORY_USAGE_PATHS).pipe(memoryUsage.count());
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

gulp.task('compress_images', function() {
    return gulp.src('./images/**/*').pipe(imagemin({'optimizationLevel': 7, 'progressive': true, 'svgoPlugins': [{'removeViewBox': false}], 'use': [pngcrush()]})).pipe(gulp.dest('./_build/images/'));
})


/*
 * Creates columns.css based on passed viewports and columns.
 *
 * Example usage:
 *     gulp make_columns --viewports 320,480,720 --columns 9 --output styles/my_columns.css
 */
gulp.task('make_columns', function() {
    var columns = [1, 2, 3, 4, 5, 6];
    var viewports = [320, 480, 720, 960, 1280, 1600, 1920];

    if (argv.columns) {
        columns = [];
        for (var i = 1; i <= argv.columns; i++)
            columns.push(i);
    }

    if (argv.viewports)
        viewports = String(argv.viewports).split(',');

    var data = {
        'data': {
            'viewports': viewports,
            'columns': columns
        }
    };

    var templatePath = './tools/_columns_template.css';

    if (argv.ie8)
        templatePath = './tools/_columns_template_ie8.css';

    var stream = gulp.src(templatePath).pipe(swig(data));

    if (argv.output)
        stream.pipe(concat(argv.output)).pipe(gulp.dest('.'));
    else
        stream.pipe(toConsole());
});


//gulp.task('server', ['templates', 'templatesToCopy', 'styles', 'scripts', 'fonts', 'images', 'media'], function() {
//    gulp.watch(TEMPLATES_SRC, ['templates', 'templatesToCopy']);
gulp.task('server', ['templates', 'styles', 'scripts', 'fonts', 'images', 'media'], function() {
    gulp.watch(TEMPLATES_SRC, ['templates']);
    gulp.watch(STYLES_SRC, ['styles']);
    gulp.watch(COPY_TASKS.scripts[0], ['scripts']);
    gulp.watch(COPY_TASKS.fonts[0], ['fonts']);
    gulp.watch(COPY_TASKS.images[0], ['images']);
    gulp.watch(COPY_TASKS.media[0], ['media']);
});


gulp.task('default', ['server']);
