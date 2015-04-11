describe('Spin', function () {

    var webdriver = require('selenium-webdriver');

    it('should do awesome stuff', function () {
        var driver = new webdriver.Builder().forBrowser(webdriver.Browser.CHROME).build();
        driver.quit();
    });
});