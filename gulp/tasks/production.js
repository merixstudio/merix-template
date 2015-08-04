var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('production', function(cb){
    cb = cb || function(){};
    runSequence('clean', 'fonts', 'styles:production', 'libs:production', 'images:production', 'media:production', 'views:production', 'browserify:production', cb);
});
