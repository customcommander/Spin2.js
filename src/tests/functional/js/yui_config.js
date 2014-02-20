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
                'tests-css': {
                    path: 'css/tests.css',
                    type: 'css'
                },
                'onload-tests': {
                    path: 'js/onload-tests.js',
                    requires: ['test', 'node', 'tests-css', 'spinjs']
                }
            }
        }
    }
};