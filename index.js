var util = require('util'),
    events = require('events'),
    fs = require('fs'),
    HTML = require('html-generate'),
    writeson = require("writeson");

var path = __dirname;

function camelize (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function makeTestData (suite) {
    var id = camelize(suite.parent + suite.title),
        icon,
        time;

    if (suite.event == 'test:pass') {
        icon = '<span style="color:#BFEB50">&#10004;</span>';
        time = suite.duration + 'ms';
    } if (suite.event == 'test:fail') {
        icon = '<span style="color:#F51800">&#10008;</span>';
        time = suite.duration + 'ms';
    } if (suite.event == 'test:pending') {
        icon = '<span style="color:#42A5F5">~</span>';
        time = 'n/a';
    }

    return {
        tagName: 'tr',
        children: [
            {
                tagName: 'td',
                text: suite.title
            },
            {
                tagName: 'td',
                html: icon
            },
            {
                tagName: 'td',
                html: '<button data-target="' + id + '" class="btn modal-trigger">Source</button>'
            },
            {
                tagName: 'td',
                text: time
            }
        ]
    }
}

function makeSourceData (suite) {
    var id = camelize(suite.parent + suite.title);

    return {
        tagName: 'div',
        attributes: {
            id: id,
            class: 'modal'
        },
        children: [
            {
                tagName: 'div',
                attributes: {
                    class: 'modal-content'
                },
                children: [
                    {
                        tagName: 'h3',
                        text: suite.parent
                    },
                    {
                        tagName: 'h4',
                        text: suite.title
                    },
                    {
                        tagName: 'p',
                        text: JSON.stringify(suite)
                    }
                ]
            },
            {
                tagName: 'div',
                attributes: {
                    class: 'modal-footer'
                },
                children: [
                    {
                        tagName: 'a',
                        attributes: {
                            href: '#',
                            class: 'modal-action modal-close waves-effect waves-green btn-flat'
                        },
                        text: 'Close'
                    }
                ]
            }
        ]
    }
}

var CustomReporter = function() {
    var result = {};
    var testTable  = {};
    var modal  = {};

    this.on('suite:start', function(suite) {
        result[suite.title] = {};
        testTable[suite.title] = [];
        modal[suite.title] = [];
    });

    this.on('test:pass', function(suite) {
        if (!result[suite.parent].pass) {
            result[suite.parent].pass = 0;
        }
        result[suite.parent].pass++;

        for(var key in testTable) {
            if (key == suite.parent) {
                testTable[key].push(makeTestData(suite));
                modal[key].push(makeSourceData(suite));
            }
        }
    });

    this.on('test:fail', function(suite) {
        if (!result[suite.parent].fail) {
            result[suite.parent].fail = 0;
        }
        result[suite.parent].fail++;

        for(var key in testTable) {
            if (key == suite.parent) {
                testTable[key].push(makeTestData(suite));
                modal[key].push(makeSourceData(suite));
            }
        }
    });

    this.on('test:pending', function(suite) {
        var icon = '<span style="color:#42A5F5">~</span>',
            id = camelize(suite.parent + suite.title);

        if (!result[suite.parent].pending) {
            result[suite.parent].pending = 0;
        }
        result[suite.parent].pending++;

        for(var key in testTable) {
            if (key == suite.parent) {
                testTable[key].push(makeTestData(suite));
                modal[key].push(makeSourceData(suite));
            }
        }
    });

    this.on('suite:end', function(value) {
        // ..do something
    });
    var final = [];
    this.on('end', function() {
        for(var key in result) {
            final.push({
                "results": key,
                "name": "Pass",
                "# of tests": result[key].pass
            });
            final.push({
                "results": key,
                "name": "Fail",
                "# of tests": result[key].fail
            });
            final.push({
                "results": key,
                "name": "Pending",
                "# of tests": result[key].pending
            });
        }
        writeson.sync(path + '/reports/data/data.json', final, "\t");
        writeson.sync(path + '/reports/data/tests.json', testTable, "\t");
        writeson.sync(path + '/reports/data/source.json', modal, "\t");
    });
};

/**
 * Inherit from EventEmitter
 */
util.inherits(CustomReporter, events.EventEmitter);

/**
 * Expose Custom Reporter
 */
module.exports = exports = CustomReporter;
