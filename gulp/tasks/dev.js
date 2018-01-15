import { task, series, parallel } from 'gulp';

const build = series('watch', 'clean', parallel('icons', 'fonts', 'styles:dev', 'polyfills:dev', 'images:dev', 'media:dev'), 'views:dev', 'scripts:dev');

task('default', build);
