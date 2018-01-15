import { task, series } from 'gulp';

task('production', (done) => {
    series('clean', 'icons', 'fonts', 'styles:production', 'polyfills:production', 'images:production', 'media:production', 'views:production', 'scripts:production', cb)();
    done();
});
