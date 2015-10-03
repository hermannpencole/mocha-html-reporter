The Epoch™ Voyager
========

Namesake
--------

[Voyager 1](https://en.wikipedia.org/wiki/Voyager_1) is a space probe launched by NASA on September 5, 1977. Part of the Voyager program to study the outer Solar System, Voyager 1 launched 16 days after its twin, Voyager 2. Having operated for 38 years and 25 days, the spacecraft still communicates with the Deep Space Network to receive routine commands and return data. At a distance of 133 AU (1.99×1010 km) as of autumn 2015, it is the farthest spacecraft from Earth and the only one in interstellar space.

Background
--------

This project started as a clone of [mocha-html-reporter](https://github.com/HermannPencole/mocha-html-reporter), but after some time in the environment, we realized that we can take advantage of [WebDriverIO](http://webdriver.io/)'s custom reporter: [http://webdriver.io/guide/testrunner/customreporter.html](http://webdriver.io/guide/testrunner/customreporter.html). 

So we made a [MaterializeCSS](http://materializecss.com/) template that met the minimal reporting needs. After which, we made a simple [JS-Template](https://www.npmjs.com/package/js-template). Now, upon command we can generate HTML from the JSON reports the [WDIO](http://webdriver.io/guide/testrunner/configurationfile.html) (WebDriverIO) session piped. 

Test Voyager
--------

To make this package usable out-the-box, we scripted more robust test coverage, and made it available in the package. Get the example running with the below steps.