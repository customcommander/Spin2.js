module.exports = function (config) {

    config.set({

        basePath: '',

        autoWatch: false,

        frameworks: ['mocha'],

        files: [
            { pattern: './node_modules/mocha/mocha.js', watched: false, included: true, served: true },
            { pattern: './node_modules/chai/chai.js'  , watched: false, included: true, served: true },
            { pattern: './src/tests/wd-temp.js'       , watched: true , included: true, served: true }
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

        reporters: ['mocha'],

        plugins:[
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-sauce-launcher'
        ],

        singleRun: true
    });

};