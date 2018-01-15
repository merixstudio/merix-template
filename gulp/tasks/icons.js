import config from '../config';
import fs from 'fs';
import { task, src, dest, series } from 'gulp';
import del from 'del';
import admZip from 'adm-zip';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import chalk from 'chalk';
import { argv } from 'yargs';

const userArgs = process.argv.slice(3);
let customUrl;

if (argv.icons) {
    customUrl = argv.icons;
}

const time = (color) => {
    let date = new Date();
        date =   ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours()) +':'
                +((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes())+':'
                +((date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds());
    let time = '[' + chalk.styles.grey.open + date + chalk.styles.grey.close + ']';

    if (color == 'red') {
       time = '[' + chalk.styles.red.open + date + chalk.styles.red.close + ']';
    }

    return time;
}

const fileExist = (file, cb) => {
    fs.stat(file, (err, stat) => {
        if(err == null) {
            series('icons:unzip', 'icons:remove', 'icons:replace', 'icons:clean', cb)();
        } else {
            console.log(time('red') + ' ' + chalk.styles.bgRed.open + 'There is no zip file in "'+file+'"' + chalk.styles.bgRed.close);
            cb();
        }
    });
}

task('icons', (cb) => {
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

task('icons:unzip', () => {
    const zipPath = customUrl || config.icons.zip;
    const zip = new admZip(zipPath);
    const zipEntries = zip.getEntries();
    let search = [];
    const files = config.icons.files;

    for (let source in files)
        search.push(source);

    zipEntries.forEach((zipEntry) => {
        const filePath = zipEntry.entryName.toString();
        if (search.indexOf(filePath) !== -1) {
            // extractEntryTo(entryName, targetPath, maintainEntryPath, overwrite)
            const test = zip.extractEntryTo(filePath, files[filePath], false, true);
            let result = chalk.styles.green.open + 'SUCCESS' + chalk.styles.green.close;
            if (!test)
                result = chalk.styles.red.open + 'FAILED' + chalk.styles.red.close;
            console.log(time() + ' Extract file: ' + chalk.styles.blue.open + filePath + chalk.styles.blue.close + ' - ' + result);
        }
    });
});

task('icons:remove', () => {
    return del([
        './styles/base/_icons.scss'
    ]);
});

task('icons:replace', (cb) => {
    const stylesFile = './styles/base/style.css';
    fs.stat(stylesFile, (err, stat) => {
        if (err == null) {
            src(stylesFile)
                .pipe(replace(config.icons.replace.from, config.icons.replace.to))
                .pipe(rename((path) => {
                    path.basename = '_icons';
                    path.extname = '.scss'
                }))
                .pipe(dest('./styles/base'));
            cb();
        } else {
            console.log(time() + chalk.styles.red.open + ' No file to change' + chalk.styles.red.close);
            cb();
        }
    });
});

task('icons:clean', () => {
    return del([
        './styles/base/style.css',
        config.icons.zip,
        customUrl || ''
    ]);
});
