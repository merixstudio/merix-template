import config from '../config';
import changed from 'gulp-changed';
import {
  dest,
  src,
  task,
} from 'gulp';

task('media:dev', () => {
    const destination = config.medias.dest;

    return src(config.medias.src)
        .pipe(changed(destination))
        .pipe(dest(destination));
});

task('media:production', () => {
    const destination = config.medias.dest;

    return src(config.medias.src)
        .pipe(dest(destination));
});
