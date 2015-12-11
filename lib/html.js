'use strict';

/**
 * Module dependencies.
 */
var Base = require('mocha').reporters.Base;
var util = require('util');
var fs = require('fs');

/**
 * Expose `HTML`.
 */

exports = module.exports = HTML;

/**
 * Initialize a new `HTML` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTML(runner) {
  Base.call(this, runner);

  let self = this;
  let stats = this.stats;
  let total = runner.total;
  let indents = 2;

  let result = "";

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('end', function() {

    let output = `
    <ul id="stats">
      <li class="progress"><canvas width="40" height="40"></canvas></li>
      <li class="passes">passes: <em>${stats.passes}</em></li>
      <li class="failures">failures: <em>${stats.failures}</em></li>
      <li class="duration">duration: <em>${(stats.end - stats.start) / 1000}</em>s</li>
    </ul><ul id="report">${result}<ul>`;

    // console.log(output);

    var data = fs.readFileSync(__dirname + '/../template.html', 'utf8');

    var content = data.replace('{{reportResult}}', output);

    console.log(content);

  });

  runner.on('suite', function(suite) {
    if (suite.root) return;
    ++indents;
    result += util.format('%s<li class="suite">\n', indent());
    ++indents;
    result += util.format('%s<h1>%s</h1>\n', indent(), htmlEscape(suite.title));
    result += util.format('%s<ul>\n', indent());
  });

  runner.on('suite end', function(suite) {
    if (suite.root) return;
    result += util.format('%s</ul>\n', indent());
    --indents;
    result += util.format('%s</li>\n', indent());
    --indents;
  });

  runner.on('pass', function(test) {
    result += util.format('%s  <li class="test pass">\n', indent());
    ++indents;
    result += util.format('%s  <h2>%s<span class="duration">%sms</span></h2>\n', indent(), htmlEscape(test.title), test.duration);
    var code = htmlEscape(clean(test.fn.toString()));
    result += util.format('%s  <pre style="display: none;"><code>%s</code></pre>\n', indent(), code);
    --indents;
    result += util.format('%s  </li>\n', indent());
  });

  runner.on('fail', function(test) {
    result += util.format('%s  <li class="test fail">\n', indent());
    ++indents;
    result += util.format('%s  <h2>%s<span class="duration">%sms</span></h2>\n', indent(), htmlEscape(test.title), test.duration);
    var str = test.err.stack || test.err.toString();
    if (!~str.indexOf(test.err.message)) {
      str = test.err.message + '\n' + str;
    }
    if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {
      str += "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
    }
    result += util.format('%s  <pre class="error">%s</pre>\n', indent(), htmlEscape(clean(str)));
    --indents;
    result += util.format('%s  </li>\n', indent());
  });
}

var htmlEscape = function(html) {
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */
var clean = function(str) {
  str = str
    .replace(/^function *\(.*\) *{/, '')
    .replace(/\s+\}$/, '');

  var spaces = str.match(/^\n?( *)/)[1].length,
    re = new RegExp('^ {' + spaces + '}', 'gm');

  str = str.replace(re, '');

  return str.replace(/^\s+|\s+$/g, '');
};
