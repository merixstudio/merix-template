import config from '../config';
import { task, src, dest } from 'gulp';

task('fonts', () => {
    return src(config.fonts.src)
        .pipe(dest(config.fonts.dest));
});
