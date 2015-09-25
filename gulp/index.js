var gulp = require('gulp'),
    shell = require('shelljs'),
    webdriver = require('../wdio');

gulp.task('default', function () {
    console.log('Voyager');
});
gulp.task('init', function () {
    shell.exec('./node_modules/.bin/selenium-standalone install');
});
// Start selenium, after running in console, open a new tab/window
gulp.task('selenium', function() {
    shell.exec('./node_modules/.bin/selenium-standalone start -Dwebdriver.chrome.driver=./node_modules/chromedriver/lib/chromedriver/chromedriver');
});
// This task runs all mocha tests gsfrom test/deploy/suite.js then prints output to Report.html
gulp.task('test', function() {
    return gulp.src('./test/wdio.*').pipe(webdriver());
});
// Create a node-static server instance to serve the './reports' folder
gulp.task('serve', function() {
    shell.exec('cd ./reports && php -S 127.0.0.1:7890');
});