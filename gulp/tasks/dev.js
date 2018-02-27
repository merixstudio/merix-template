import {
  parallel,
  series,
  task,
} from 'gulp';

const build = series('clean', 'scripts:dev', 'watch', parallel('icons', 'fonts', 'styles:dev', 'polyfills:dev', 'images:dev', 'media:dev'), 'views:dev');

task('default', build);
