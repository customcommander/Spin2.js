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
                },
                'helpers-for-tests': {
                    path: 'js/helpers.js',
                    requires: ['node', 'promise']
                }
            }
        },
        // tests files
        'tests': {
            base: './js/',
            aliases: {
                // stuff you (always) need for functional tests
                'functional-test-resources': [
                    'test',
                    'node',
                    'node-event-simulate',
                    'css-for-tests',
                    'helpers-for-tests'
                ],
                // same as above (@todo merge?)
                'unit-test-resources': [
                    'test',
                    'node',
                    'helpers-for-tests'
                ]
            },
            modules: {
                'unit-onload-tests': {
                    path: 'onload-tests.js',
                    requires: ['unit-test-resources']
                },
                'unit-config-tests': {
                    path: 'config-tests.js',
                    requires: ['unit-test-resources']
                },
                'unit-breadcrumb-tests': {
                    path: 'breadcrumb-tests.js',
                    requires: ['unit-test-resources']
                },

// functional tests
//
// the tests below have no knowledge of the underlying code.
// they only make sure that the requirements are met.
// for example: if the user clicks on the close button, we should not test
// that function a or b has been called but only that the window has been closed.

                'functional-onload-tests': {
                    path: 'onload-tests.js',
                    requires: ['functional-test-resources', 'spinjs']
                },
                'functional-dimensions-tests': {
                    path: 'dimensions-tests.js',
                    requires: ['functional-test-resources', 'spinjs']
                },
                'functional-position-tests': {
                    path: 'position-tests.js',
                    requires: ['functional-test-resources', 'spinjs']
                },
                'functional-navclick-tests': {
                    path: 'navclick-tests.js',
                    requires: ['functional-test-resources', 'spinjs']
                },
                'functional-breadcrumb-tests': {
                    path: 'breadcrumb-tests.js',
                    requires: ['functional-test-resources', 'spinjs']
                }
            }
        }
    }
};
