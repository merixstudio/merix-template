var config          = require('../config');
var gulp            = require('gulp');
var runSequence     = require('run-sequence');
var bs              = require('browser-sync');
var nunjucksRender  = require('gulp-nunjucks-render');

gulp.task('views:dev:render', function() {
    var nunjucksSettings = {
		path: 'templates/',
		envOptions: {
			watch: true
		}
	};
    return gulp.src(config.views.src)
        .pipe(nunjucksRender(nunjucksSettings))
        .pipe(gulp.dest(config.views.dest));
});

gulp.task('views:dev', function(cb) {
    var browserSync = bs.get('pigie');

    runSequence('views:dev:render', browserSync.reload);
    cb();
});

gulp.task('views:production', function() {
    var nunjucksSettings = {
		path: 'templates/',
		envOptions: {
			watch: false
		}
	};
    return gulp.src(config.views.src)
        .pipe(nunjucksRender(nunjucksSettings))
        .pipe(gulp.dest(config.views.dest));
});
