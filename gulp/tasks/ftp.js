var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var cliSpinner = require('cli-spinner').Spinner;
var ftp = require('gulp-ftp');

gulp.task('ftp', function () {
    var spinner = new cliSpinner('Uploading.. %s');
    spinner.setSpinnerString('|/-\\');
    
    function getProjectName() {
        var projectName = __dirname.split("\\");
        return projectName[projectName.length - 3];
    }
    
    var ftpPath = __dirname.replace(getProjectName() + '\\gulp\\tasks', 'ftp.json');
    
    function getFtpData() {
        return JSON.parse(fs.readFileSync(ftpPath), 'utf8');
    }
    
    fs.stat(ftpPath, function(err,stats) {
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
                    // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
                    // this can be a gulp plugin, gulp.dest, or any kind of stream 
                    // here we use a passthrough stream 
                    .on('finish', function() {
                        spinner.stop();
                    })
                    .pipe(gutil.noop()); 
        } else {
            var ftpExamplePath = ftpPath.replace('ftp.json', 'ftp_example.json');
            fs.writeFile(ftpExamplePath, '{\n"host": "website.com",\n"user": "johndoe",\n"pass": "1234",\n"domain": "domain.com"\n}', (err) => {
                if (err) throw err;
                console.log('Can\'t found ftp.json file with access data. Check file ' + ftpExamplePath + ', rename to \"ftp.json\" and run \"gulp ftp\" again.');
            });
            return true;
        }
    });
});