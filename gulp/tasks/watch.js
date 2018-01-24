import config from '../config';
import {
  series,
  task,
  watch,
} from 'gulp';

task('watch', series('browserSync', (done) => {
    watch(config.polyfills.src, series('polyfills:dev'));
    watch(config.fonts.src, series('fonts'));
    watch(config.styles.src, series('styles:dev'));
    watch(config.images.src, series('images:dev'));
    watch(config.medias.src, series('media:dev'));
    watch(config.views.watch, series('views:dev'));
    done();
}));
