var main = require('../main'),
    fs = require('fs'),
    HTML = require('html-generate'),
    jsTemplate = require('js-template');

// Templates
var defaultTemplate = main.path + '/templates/html/default.html',
    defaultHTML = fs.readFileSync(defaultTemplate, "utf8");

// Data
var testsHTML = main.path + '/reports/views/tests.html',
    testerHTML = main.path + '/reports/views/tester.html',
    modalsHTML = main.path + '/reports/views/source.html',
    tests = fs.readFileSync(testsHTML, "utf8"),
    tester = fs.readFileSync(testerHTML, "utf8"),
    modals = fs.readFileSync(modalsHTML, "utf8");

var today = new Date(),
    dd = today.getDate(),
    mm = today.getMonth() + 1,
    yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}

today = mm + '.' + dd + '.' + yyyy;

var allData = {};
var dataJSON = main.path + '/reports/data/user.json';
var testerData = require(dataJSON);

allData['data'] = testerData;
allData['data'].date = today;
allData['data'].tests = tests;
allData['data'].tester = tester;
allData['data'].modals = modals;

function templatize() {
    var testerFile = main.path + '/templates/tester.js',
        testsFile = main.path + '/templates/test.js',
        sourceFile = main.path + '/templates/source.js',
        makeTester = require(testerFile),
        makeSources = require(sourceFile),
        makeTests = require(testsFile);

    makeTester.createTesterHTML();
    makeSources.createModalHTML();
    makeTests.createTestDataHTML();

    setTimeout(function (){
        var theDefaultTemplate = jsTemplate(defaultHTML, allData['data']);
        fs.writeFile('./reports/index.html', theDefaultTemplate, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }, 1000);
    //console.log(makeTester);
}

module.exports = {
    templatize: templatize
};