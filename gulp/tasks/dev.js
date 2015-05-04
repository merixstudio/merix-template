var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(cb){
    cb = cb || function(){};
    runSequence('fonts', 'styles', 'images', 'medias', 'views', 'browserify', 'watch', cb);
});
