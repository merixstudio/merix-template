var config = require('../config');
var gulp   = require('gulp');

gulp.task('watch', ['browserSync'], function(){

    gulp.watch(config.scripts.src, ['lint:dev', 'browserify:dev']);
    gulp.watch(config.fonts.src, ['fonts']);
    gulp.watch(config.styles.src, ['styles:dev']);
    gulp.watch(config.images.src, ['images:dev', 'reload']);
    gulp.watch(config.views.watch, ['views:dev']);

});
