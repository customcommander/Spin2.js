var webdriver = require('selenium-webdriver');

var DEFAULT_BROWSER  = webdriver.Browser.FIREFOX;
var SAUCE_USERNAME   = process.env.SAUCE_USERNAME;
var SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;

// Use default browser if none in particular was defined
if (!process.env.SELENIUM_BROWSER) {
    process.env.SELENIUM_BROWSER = DEFAULT_BROWSER;
}

// Use Saucelabs if credentials are set
// When running on Travis, these can be set as environment variables.
// But if a remote is already defined then keep using it.
if (!process.env.SELENIUM_REMOTE_URL && SAUCE_USERNAME && SAUCE_ACCESS_KEY) {
    process.env.SELENIUM_REMOTE_URL =
        'http://'+SAUCE_USERNAME+':'+SAUCE_ACCESS_KEY+'@ondemand.saucelabs.com/wd/hub';
}

describe('Integration Tests', function () {

    beforeEach(function () {
        this.driver = new webdriver.Builder().build();
    });

    afterEach(function (done) {
        this.driver.quit().then(done);
    });

    describe('On Page Load', function () {

        it('should do awesome stuff', function (done) {
            this.driver.get('http://www.google.com').then(done);
        });
    });
});
