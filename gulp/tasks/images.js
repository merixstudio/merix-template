import config from '../config';
import changed from 'gulp-changed';
import {
  dest,
  src,
  task,
} from 'gulp';

task('images:dev', () => {
    const destination = config.images.dest;

    return src(config.images.src)
        .pipe(changed(destination))
        .pipe(dest(destination));
});

task('images:production', () => {
    const destination = config.images.dest;

    return src(config.images.src)
        .pipe(dest(destination));
});
