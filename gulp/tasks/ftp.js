var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var cliSpinner = require('cli-spinner').Spinner;
var ftp = require('gulp-ftp');
var path = require('path');

gulp.task('ftp', function () {
    var spinner = new cliSpinner('Uploading.. %s');
    spinner.setSpinnerString('|/-\\');

    function getProjectName() {
        var projectName = __dirname.split("\\");
        return projectName[projectName.length - 3];
    }
    var ftpPath = path.resolve(__dirname, '../../', 'ftp.json');

    function getFtpData() {
        return JSON.parse(fs.readFileSync(ftpPath), 'utf8');
    }

    fs.stat(ftpPath, function(err, stats) {
        if (err == null) {
            var data = getFtpData();
            spinner.start();

            return gulp.src('_build/**/*')
                    .pipe(ftp({
                        host: data.host,
                        user: data.user,
                        pass: data.pass,
                        remotePath: '/domains/' + data.domain + '/public_html/' + getProjectName()
                    }))
                    .on('finish', function() {
                        spinner.stop();
                        console.log('\nURL: http://' + data.domain + '/' + getProjectName() + '/');
                    })
                    .pipe(gutil.noop());
        } else {
            var ftpExamplePath = ftpPath.replace('ftp.json', 'ftp_example.json');
            fs.writeFile(ftpExamplePath, '{\n"host": "live-preview.com",\n"user": "johndoe",\n"pass": "1234",\n"domain": "XX.live-preview.com"\n}', (err) => {
                if (err) throw err;
                console.log('Can\'t found ftp.json file with access data. Check file ' + ftpExamplePath + ', rename to \"ftp.json\" and run \"gulp ftp\" again.');
            });
            return true;
        }
    });
});
