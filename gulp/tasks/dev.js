var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(cb){
    cb = cb || function() {};
    runSequence('fonts', 'styles:dev', 'polyfills:dev', 'images:dev', 'media:dev', 'views:dev', 'browserify:dev', 'watch', cb);
});
