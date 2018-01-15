import config from '../config';
import { create } from 'browser-sync';
import { task } from 'gulp';
import yargs from 'yargs'

const bs = create('merix');
const argv = yargs.argv;

let browser = '';
let notify = true;
let open = false;

if (argv.chrome) {
    browser = 'chrome';
    open = true;
} else if (argv.firefox) {
    browser = 'firefox';
    open = true;
}

if (argv.nonotify) {
    notify = false;
}

if (argv.open) {
    open = true;
}

task('browserSync', (done) => {
    bs.init({
        server: {
            baseDir: './_build'
        },
        port: config.serverport,
        browser: browser,
        notify: notify,
        open: open
    });
    done();
});
