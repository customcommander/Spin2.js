YUI_config = {
    groups: {
        // build files
        'build': {
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
        // css development files
        'dev-css': {
            base: '../../css/',
            modules: {
                'dev-csscombo': {
                    path: 'combo.css',
                    type: 'css'
                },
                'dev-csscore': {
                    path: 'spin.css',
                    requires: ['dev-csscombo'],
                    type: 'css'
                }
            }
        },
        // javascript development files
        'dev-js': {
            base: '../../js/',
            modules: {
                'dev-utils': {
                    path: 'utils.js'
                },
                'dev-config': {
                    path: 'config.js',
                    requires: ['dev-utils']
                },
                'dev-panel': {
                    path: 'panel.js'
                },
                'dev-breadcrumb': {
                    path: 'breadcrumb.js'
                },
                'dev-spin': {
                    path: 'spin.js',
                    requires: [
                        'dev-csscore',
                        'dev-utils',
                        'dev-config',
                        'dev-panel',
                        'dev-breadcrumb'
                    ]
                }
            }
        },
        // shared resources for tests
        'tests-share': {
            base: '../share/',
            modules: {
                'css-for-tests': {
                    path: 'css/tests.css',
                    type: 'css'
                }
            }
        },
        // tests files
        'tests': {
            base: './js/',
            modules: {
                'unit-onload-tests': {
                    path: 'onload-tests.js',
                    requires: ['test', 'node', 'dev-spin']
                },
                'unit-utils-tests': {
                    path: 'utils-tests.js',
                    requires: ['test', 'node', 'dev-utils']
                },
                'unit-config-tests': {
                    path: 'config-tests.js',
                    requires: ['test', 'node', 'dev-config']
                },
                'functional-onload-tests': {
                    path: 'onload-tests.js',
                    requires: ['test', 'node', 'css-for-tests', 'spinjs']
                }
            }
        }
    }
};
