var main = require('../main'),
    fs = require('fs'),
    HTML = require('html-generate');

var sourceFile = main.path + '/reports/data/source.json',
    sourceData = require(sourceFile),
    sources = main.path + '/reports/views/source.html';

fs.truncate(sources, 0, function (err) {
    if (err) return console.error(err);
});

var createModalHTML = function createModalHTML () {
    for(var key in sourceData) {
        for(var all in sourceData[key]) {
            var sourceCode = HTML.element(sourceData[key][all]);
            fs.appendFile(sources, sourceCode, function (err) {
                if (err) return console.error(err);
            });
        }
    }
};

module.exports = {
    createModalHTML: createModalHTML
};