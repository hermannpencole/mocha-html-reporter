mocha-html-reporter
===================

HTML reporter for Mocha.

# Use

Create html fragment with mocha-html-reporter and add head and tail.

<pre>
# npm install mocha-html-reporter

# mocha dir --reporter mocha-html-reporter |  \  
	cat node_modules/mocha-html-reporter/docs/head.html - node_modules/mocha-html-reporter/docs/tail.html \  
	> test.html
</pre>
