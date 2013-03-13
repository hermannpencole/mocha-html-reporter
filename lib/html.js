/**
 * Module dependencies.
 */
var Base = require('mocha').reporters.Base;
var util = require('util');

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

  var self = this
    , stats = this.stats
    , total = runner.total
    , indents = 2;

  var result = "";

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('end', function(){
    console.log('<ul id="stats"><li class="progress"><canvas width="40" height="40"></canvas></li><li class="passes">passes: <em>%s</em></li><li class="failures">failures: <em>%s</em></li><li class="duration">duration: <em>%s</em>s</li></ul>', stats.passes, stats.failures, (stats.end - stats.start) / 1000);
	console.log('<ul id="report">' + result + '<ul>');
  });

  runner.on('suite', function(suite){
    if (suite.root) return;
    ++indents;
    result += util.format('%s<li class="suite">\n', indent());
    ++indents;
    result += util.format('%s<h1>%s</h1>\n', indent(), htmlEscape(suite.title));
    result += util.format('%s<ul>\n', indent());
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    result += util.format('%s</ul>\n', indent());
    --indents;
    result += util.format('%s</li>\n', indent());
    --indents;
  });

  runner.on('pass', function(test){
    result += util.format('%s  <li class="test pass">\n', indent());
    ++indents;
    result += util.format('%s  <h2>%s<span class="duration">%sms</span></h2>\n', indent(), htmlEscape(test.title), test.duration);
    var code = htmlEscape(clean(test.fn.toString()));
    result += util.format('%s  <pre style="display: none;"><code>%s</code></pre>\n', indent(), code);
    --indents;
   result += util.format('%s  </li>\n', indent());
  });

  runner.on('fail', function(test){
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
    result += util.format('%s  <pre class="error">%s</pre>\n', indent(),  htmlEscape(clean(str)) );
    --indents;
    result += util.format('%s  </li>\n', indent());
  });
}

var htmlEscape = function(html){
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

  var spaces = str.match(/^\n?( *)/)[1].length
    , re = new RegExp('^ {' + spaces + '}', 'gm');

  str = str.replace(re, '');

  return str.replace(/^\s+|\s+$/g, '');
};
