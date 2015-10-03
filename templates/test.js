var main = require('../main'),
    fs = require('fs'),
    HTML = require('html-generate');

var tableFile = main.path + '/reports/data/tests.json',
    testTableData = require(tableFile),
    tables = main.path + '/reports/views/tests.html';

fs.truncate(tables, 0, function (err) {
    if (err) return console.error(err);
});

function createTestDataHTML() {
    for(var key in testTableData) {
        var suites = {
            tagName: 'div',
            attributes: {
                class: 'section'
            },
            children: [
                {
                    tagName: 'div',
                    attributes: {
                        class: 'row'
                    },
                    children: [
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'col s12 center-align'
                            },
                            children: [
                                {
                                    tagName: 'h1',
                                    attributes: {
                                        id: key,
                                        class: 'z-depth-1 #009688 teal truncate',
                                        style: 'font-weight:800;' +
                                        'font-style:italic;' +
                                        'text-transform:uppercase;' +
                                        'color:#FFFFFF;' +
                                        'font-size:3em'
                                    },
                                    text: key
                                }
                            ]
                        }
                    ]
                },
                {
                    tagName: 'div',
                    attributes: {
                        class: 'container'
                    },
                    children: [
                        {
                            tagName: 'table',
                            attributes: {
                                class: 'responsive-table'
                            },
                            children: [
                                {
                                    tagName: 'thead',
                                    children: [
                                        {
                                            tagName: 'th',
                                            text: 'Mission'
                                        },
                                        {
                                            tagName: 'th',
                                            text: 'Status'
                                        },
                                        {
                                            tagName: 'th',
                                            text: 'Console'
                                        },
                                        {
                                            tagName: 'th',
                                            text: 'Time'
                                        }
                                    ]
                                },
                                {
                                    tagName: 'tbody',
                                    children: testTableData[key]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        var testsHTML = HTML.element(suites);
        fs.appendFile(tables, testsHTML, function (err) {
            if (err) return console.error(err);
        });
    }
}

module.exports = {
    createTestDataHTML: createTestDataHTML
};