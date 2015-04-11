describe('Spin', function () {

    var webdriver = require('selenium-webdriver');

    it('should do awesome stuff', function () {
        var driver = new webdriver.Builder().
                forBrowser(webdriver.Browser.CHROME).
                usingServer('http://'+process.env.SAUCE_USERNAME+':'+process.env.SAUCE_ACCESS_KEY+'@ondemand.saucelabs.com/wd/hub').
                build();
        driver.quit();
    });
});