import fs from 'fs';
import path from 'path';
import config from '../config';
import { task, src, dest } from 'gulp';
import sass from 'gulp-sass';
import sassNpm from 'sass-npm';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import { get } from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';

sassNpm();

const importer = (url, file, done) => {
    // look for modules installed through npm
    try {
        const newPath = require.resolve(url);
        fs.exists(newPath, (exists) => {
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

task('styles:dev', () => {
    const browserSync = get('merix');

    return src(config.styles.src)
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
        .pipe(dest(config.styles.dest))
        .pipe(browserSync.stream());
});

task('styles:production', () => {
    return src(config.styles.src)
        .pipe(sass({
            outputStyle: 'compressed',
            importer: importer
        }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(dest(config.styles.dest));
});
