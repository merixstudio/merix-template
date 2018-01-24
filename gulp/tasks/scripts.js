import config from '../config';
import {
  dest,
  task,
} from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import { get } from 'browser-sync';

const buildDev = (file) => {
    const browserSync = get('merix');

    const bundler = browserify({
        entries: config.browserify.entries,
        cache: {},
        packageCache: {},
        fullPaths: false,
        debug: true
    }).transform("babelify", { presets: ["env", "stage-3"] });

    bundler.plugin(watchify, {
        ignoreWatch: ['**/node_modules/**', '_build/**']
    });

    bundler.on('update', () => {
       rebundle();
    });

    // bundler.on('log', gutil.log);

    const rebundle = () => {
        const stream = bundler.bundle();
        return stream.on('error', (err) => {
                gutil.log(err);
            })
            .pipe(source(config.browserify.bundleName))
            .pipe(dest(config.scripts.dest))
            .pipe(browserSync.stream());
    }

    return rebundle();
};

const buildProduction = () => {
    const bundler = browserify({
        entries: config.browserify.entries,
        cache: {},
        packageCache: {},
        fullPaths: false,
        debug: false
    }).transform("babelify", { presets: ["es2015", "stage-3"] });

    const rebundle = () => {
        const stream = bundler.bundle();
        return stream.on('error', (err) => {
                gutil.log(err);
            })
            .pipe(source(config.browserify.bundleName))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(dest(config.scripts.dest));
    }

    return rebundle();
};

task('scripts:dev', () => {
    return buildDev();
});

task('scripts:production', () => {
    return buildProduction();
});
