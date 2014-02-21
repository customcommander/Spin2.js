YUI_config = {
    groups: {
        'spinjs-build': {
            base: '../../../build/spin/',
            modules: {
                'spinjs-css': {
                    path: 'spin.css',
                    type: 'css'
                },
                'spinjs': {
                    path: 'spin.js',
                    requires: ['spinjs-css']
                }
            }
        },
        'spinjs-tests': {
            base: './',
            modules: {
                'onload-tests': {
                    path: 'js/onload-tests.js',
                    requires: ['test', 'node', 'css-for-tests', 'spinjs']
                }
            }
        },
        // shared resources for tests
        'spinjs-tests-share': {
            base: '../share/',
            modules: {
                'css-for-tests': {
                    path: 'css/tests.css',
                    type: 'css'
                }
            }
        }
    }
};