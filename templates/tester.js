var main = require('../main'),
    fs = require('fs'),
    HTML = require('html-generate'),
    jsTemplate = require('js-template');

var dataJSON = main.path + '/reports/data/user.json',
    userData = require(dataJSON),
    tester = main.path + '/reports/views/tester.html',
    testerTemplate = main.path + '/templates/html/tester.html';

var createTesterHTML = function createTesterHTML () {
    var testerHTML = jsTemplate(testerTemplate, userData);
    fs.writeFile(tester, testerHTML, function (err) {
        if (err) return console.error(err);
    });
};

module.exports = {
    createTesterHTML: createTesterHTML
};