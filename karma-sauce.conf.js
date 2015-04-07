module.exports = function (config) {

    config.set({

        basePath: '',

        autoWatch: false,

        frameworks: ['mocha'],

        files: [
            { pattern: './src/tests/wd-temp.js'       , watched: false, included: false, served: false }
        ],

        browsers: ['sauceFirefox29','sauceFirefox28'],

        customLaunchers: {

            sauceFirefox29: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'Linux',
                version: '29.0'
            },

            sauceFirefox28: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'Linux',
                version: '28.0'
            }
        },

        reporters: [
            'mocha',
            'saucelabs'
        ],

        plugins:[
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-sauce-launcher'
        ],

        singleRun: true
    });

};