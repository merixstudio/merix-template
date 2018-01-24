import { task } from 'gulp';
import { reload } from 'browser-sync';

task('reload', () => {
    reload();
});
