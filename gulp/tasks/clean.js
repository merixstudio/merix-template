import config from '../config';
import { task } from 'gulp';
import del from 'del';

task('clean', (done) => {
    del.sync([config.dist.root]);
    done();
});
