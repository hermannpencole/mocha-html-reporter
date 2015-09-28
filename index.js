var shell = require('shelljs'),
    util = require('util'),
    events = require('events'),
    fs = require('fs'),
    HTML = require('html-generate'),
    writeson = require("writeson"),
    jsTemplate = require('js-template');

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

var CustomReporter = function() {
    var result = {};
    var source = {
        results: result
    };

    this.on('suite:start', function(suite) {
        result[suite.title] = {};
    });

    this.on('test:pass', function(suite) {
        if (!result[suite.parent].pass) {
            result[suite.parent].pass = 0;
        }
        result[suite.parent].pass++;
    });
    //
    this.on('test:fail', function(suite) {
        if (!result[suite.parent].fail) {
            result[suite.parent].fail = 0;
        }
        result[suite.parent].fail++;
    });
    //
    this.on('test:pending', function(suite) {
        if (!result[suite.parent].pending) {
            result[suite.parent].pending = 0;
        }
        result[suite.parent].pending++;
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
        writeson.sync("reports/data/data.json", final, "\t");
    });
};

/**
 * Inherit from EventEmitter
 */
util.inherits(CustomReporter, events.EventEmitter);

/**
 * Expose Custom Reporter
 */
exports = module.exports = CustomReporter;