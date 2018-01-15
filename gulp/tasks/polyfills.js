import config from '../config';
import changed from 'gulp-changed';
import { task, src, dest } from 'gulp';

task('polyfills:dev', () => {
    const destination = config.polyfills.dest;

    return src(config.polyfills.src)
        .pipe(changed(destination))
        .pipe(dest(destination));
});

task('polyfills:production', () => {
    const destination = config.polyfills.dest;

    return src(config.polyfills.src)
        .pipe(dest(destination));
});
