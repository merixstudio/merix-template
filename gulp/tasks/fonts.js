import config from '../config';
import {
  dest,
  src,
  task,
} from 'gulp';

task('fonts', () => {
    return src(config.fonts.src)
        .pipe(dest(config.fonts.dest));
});
