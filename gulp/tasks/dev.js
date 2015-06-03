var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(cb){
    cb = cb || function() {};
    runSequence('fonts', 'styles:dev', 'libs:dev', 'images:dev', 'media:dev', 'views', 'browserify:dev', 'lint:dev', 'watch', cb);
});
