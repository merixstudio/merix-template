var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('production', function(cb){
    cb = cb || function(){};
    runSequence('clean', 'fonts', 'styles:production', 'images:production', 'media:production', 'views', 'browserify:production', cb);
});
