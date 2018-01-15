import config from '../config';
import { task, src, dest, series } from 'gulp';
import { get } from 'browser-sync';
import nunjucksRender from 'gulp-nunjucks-render';

task('views:dev:render', () => {
    const nunjucksSettings = {
		path: 'templates/',
		envOptions: {
			watch: true
		}
	};
    return src(config.views.src)
        .pipe(nunjucksRender(nunjucksSettings))
        .pipe(dest(config.views.dest));
});

task('views:dev', (done) => {
    const browserSync = get('merix');

    series('views:dev:render', browserSync.reload)();
    done();
});

task('views:production', () => {
    const nunjucksSettings = {
		path: 'templates/',
		envOptions: {
			watch: false
		}
	};
    return src(config.views.src)
        .pipe(nunjucksRender(nunjucksSettings))
        .pipe(dest(config.views.dest));
});
