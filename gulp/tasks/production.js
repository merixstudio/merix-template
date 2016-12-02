var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('production', function(cb){
    cb = cb || function(){};
    runSequence('clean', 'icons', 'fonts', 'styles:production', 'polyfills:production', 'images:production', 'media:production', 'views:production', 'scripts:production', cb);
});
