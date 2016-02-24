var config = require('../config');
var fs = require('fs');
var gulp   = require('gulp');
var del    = require('del');
var admZip = require('adm-zip');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var chalk = require('chalk');
var userArgs = process.argv.slice(3);
var customUrl;
if (userArgs.length)
    customUrl = userArgs[0].slice(1);

function time(color) {
    var date = new Date();
        date =   ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours()) +':'
                +((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes())+':'
                +((date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds());
    var time = '[' + chalk.styles.grey.open + date + chalk.styles.grey.close + ']';

    if (color == 'red') {
       time = '[' + chalk.styles.red.open + date + chalk.styles.red.close + ']';
    }

    return time;
}

function fileExist(file, cb) {
    fs.stat(file, function(err, stat) {
        if(err == null) {
            runSequence('icons:unzip', 'icons:remove', 'icons:replace', 'icons:clean', cb);
        } else {
            console.log(time('red') + ' ' + chalk.styles.bgRed.open + 'There is no zip file in "'+file+'"' + chalk.styles.bgRed.close);
            cb();
        }
    });
}

gulp.task('icons', function(cb) {
    cb = cb || function() {};
    if (config.icons.enable) {
        if (customUrl) {
            fileExist(customUrl, cb);
        } else {
            fileExist(config.icons.zip, cb);
        }
    } else {
        console.log(time('red') + ' ' + chalk.styles.bgRed.open + 'Unzipping files is disabled in config' + chalk.styles.bgRed.close);
        cb();
    }
});

gulp.task('icons:unzip', function() {
    var zipPath = customUrl || config.icons.zip;
    var zip = new admZip(zipPath);
    var zipEntries = zip.getEntries();
    var search = [];
    var files = config.icons.files;

    for (var source in files)
        search.push(source);

    zipEntries.forEach(function(zipEntry) {
        var filePath = zipEntry.entryName.toString();
        if (search.indexOf(filePath) !== -1) {
            // extractEntryTo(entryName, targetPath, maintainEntryPath, overwrite)
            var test = zip.extractEntryTo(filePath, files[filePath], false, true);
            var result = chalk.styles.green.open + 'SUCCESS' + chalk.styles.green.close;
            if (!test)
                result = chalk.styles.red.open + 'FAILED' + chalk.styles.red.close;
            console.log(time() + ' Extract file: ' + chalk.styles.blue.open + filePath + chalk.styles.blue.close + ' - ' + result);
        }
    });
});

gulp.task('icons:remove', function() {
    return del([
        './styles/base/_icons.scss'
    ]);
});

gulp.task('icons:replace', function(cb) {
    var stylesFile = './styles/base/style.css';
    fs.stat(stylesFile, function(err, stat) {
        if (err == null) {
            gulp.src(stylesFile)
                .pipe(replace(config.icons.replace.from, config.icons.replace.to))
                .pipe(rename(function (path) {
                    path.basename = '_icons';
                    path.extname = '.scss'
                }))
                .pipe(gulp.dest('./styles/base'));
            cb();
        } else {
            console.log(time() + chalk.styles.red.open + ' No file to change' + chalk.styles.red.close);
            cb();
        }
    });
});

gulp.task('icons:clean', function() {
    return del([
        './styles/base/style.css',
        config.icons.zip,
        customUrl || ''
    ]);
});


