var gulp = require('gulp'),
    shell = require('shelljs'),
    webdriver = require('./index');

gulp.task('init', function (done) {
    shell.exec('./node_modules/.bin/selenium-standalone install');
});
// Start selenium, after running in console, open a new tab/window
gulp.task('selenium', function(done) {
    shell.exec('./node_modules/.bin/selenium-standalone start -Dwebdriver.chrome.driver=./node_modules/chromedriver/lib/chromedriver/chromedriver');
    done();
});
// This task runs all mocha tests gsfrom test/deploy/suite.js then prints output to Report.html
gulp.task('test', function() {
    return gulp.src('wdio.*').pipe(webdriver());
});
// Create a node-static server instance to serve the './data/projects/deployments' folder
gulp.task('serve', function() {
    shell.exec('cd data/deployments && php -S 127.0.0.1:7890');
});
