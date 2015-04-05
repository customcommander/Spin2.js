module.exports = function (config) {

    config.set({

        basePath: '',

        autoWatch: false,

        frameworks: ['mocha'],

        files: [
            { pattern: './node_modules/mocha/mocha.js', watched: false, included: true, served: true },
            { pattern: './node_modules/chai/chai.js'  , watched: false, included: true, served: true },
            { pattern: './src/tests/temp.js'          , watched: true , included: true, served: true }
        ],

        browsers: ['PhantomJS'],

        reporters: ['mocha'],

        plugins:[
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher'
        ],

        singleRun: true
    });

};