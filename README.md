Voyager - Mocha Reporter
========================

## TODO

1. ThreeD Graphs and Charts
2. Test Report UI


## Use

Create html fragment with mocha-html-reporter and add head and tail.

	npm install epoch-voyager

	mocha path/to/test --reporter mocha-html-reporter | cat path/to/voyager/docs/head.html - path/to/voyager/docs/tail.html	> Report.html
