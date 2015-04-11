describe('Spin', function () {

    var webdriver = require('selenium-webdriver');

    it('should do awesome stuff', function () {
        var driver = new webdriver.Builder().build();
        driver.quit();
    });
});