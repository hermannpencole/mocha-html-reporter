var shell = require('shelljs'),
    util = require('util'),
    events = require('events'),
    fs = require('fs'),
    HTML = require('html-generate'),
    jsTemplate = require('js-template');

var CustomReporter = function() {
    var modalTemplate = './reports/views/source.html',
        defaultTemplate = './reports/views/default.html',
        indexFile = './reports/index.html',
        templateHtml = fs.readFileSync(defaultTemplate, "utf8"),
        modalHtml = fs.readFileSync(modalTemplate, "utf8");

    var modal = [],
        table = [],
        htmlObject,
        sourceModal;

    this.on('test:start', function() {
        return htmlObject = {
            tagName: 'div',
            attributes: {
                id: 'voyage',
                class: 'container'
            },
            children: [
                {
                    tagName: 'div',
                    attributes: {
                        id: 'status',
                        class: 'row'
                    },
                    children: [
                        {
                            tagName: 'div',
                            attributes: {
                                id: 'mission-control-header',
                                class: 'col s12 center-align'
                            },
                            children: [
                                {
                                    tagName: 'h1',
                                    attributes: {
                                        id: 'mission-control-logo',
                                        class: 'z-depth-5',
                                        style: 'font-weight:800;font-style:italic;text-transform:uppercase'
                                    },
                                    text: 'Voyager'
                                }
                            ]
                        }
                    ]
                },
                {
                    tagName: 'div',
                    attributes: {
                        id: 'mission-report',
                        class: 'container'
                    },
                    children: [
                        {
                            tagName: 'table',
                            attributes: {
                                id: 'mission-report-table',
                                class: 'responsive-table'
                            },
                            children: [
                                {
                                    tagName: 'thead',
                                    attributes: {
                                        id: 'mission-report-table-header'
                                    },
                                    children: [
                                        {
                                            tagName: 'tr',
                                            children: [
                                                {
                                                    tagName: 'th',
                                                    attributes: {
                                                        id: 'mission-report-table-mission'
                                                    },
                                                    text: 'Mission'
                                                },
                                                {
                                                    tagName: 'th',
                                                    attributes: {
                                                        id: 'mission-report-table-status'
                                                    },
                                                    text: 'Status'
                                                },
                                                {
                                                    tagName: 'th',
                                                    attributes: {
                                                        id: 'mission-report-table-console'
                                                    },
                                                    text: 'Console'
                                                },
                                                {
                                                    tagName: 'th',
                                                    attributes: {
                                                        id: 'mission-report-table-time'
                                                    },
                                                    text: 'Time'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tagName: 'tbody',
                                    children: table
                                }
                            ]
                        }
                    ]

                }
            ]
        }
    });

    this.on('test:pass', function(value) {
        var mission = value.title,
            time = value.duration.toString(),
            id = 'modal' + value.pid;

        table.push({
            tagName: 'tr',
            children: [
                {
                    tagName: 'td',
                    text: mission
                },
                {
                    tagName: 'td',
                    html: '<span style="color:#BFEB50">&#10004;</span>'
                },
                {
                    tagName: 'td',
                    html: '<button data-target="' + id + '" class="btn modal-trigger">Source</button>'
                },
                {
                    tagName: 'td',
                    text: time + 'ms'
                }
            ]
        });

        var sourceData = JSON.stringify(value);

        var modal = {
            modalID: id,
            modalHeader: '<h4>' + value.title + '</h4>',
            modalBody: '<p>' + sourceData + '</p>'
        };

        return sourceModal = jsTemplate(modalHtml, modal);
    });

    this.on('test:fail', function(value) {
        var mission = value.title,
            time = value.duration.toString(),
            id = 'modal' + value.pid;

        table.push({
            tagName: 'tr',
            children: [
                {
                    tagName: 'td',
                    text: mission
                },
                {
                    tagName: 'td',
                    html: '<span style="color:#F51800">&#10008;</span>'
                },
                {
                    tagName: 'td',
                    html: '<button data-target="' + id + '" class="btn modal-trigger">Source</button>'
                },
                {
                    tagName: 'td',
                    text: time + 'ms'
                }
            ]
        });

        var sourceData = JSON.stringify(value);

        var modal = {
            modalID: id,
            modalHeader: '<h4>' + value.title + '</h4>',
            modalBody: '<p>' + sourceData + '</p>'
        };

        return sourceModal = jsTemplate(modalHtml, modal);
    });

    this.on('test:end', function() {
        var html = HTML.element(htmlObject);

        var data = {
            title: 'Voyager | Mission Reports',
            body: html,
            modals: sourceModal
        };

        var result = jsTemplate(templateHtml, data);

        fs.writeFile(indexFile, result, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    });


    //this.on('test:pending', function(value) {
    //    console.log(value.parent);
    //    console.log(value.title);
    //    console.log(value.event);
    //    console.log(value.err);
    //});
};

/**
 * Inherit from EventEmitter
 */
util.inherits(CustomReporter, events.EventEmitter);

/**
 * Expose Custom Reporter
 */
exports = module.exports = CustomReporter;