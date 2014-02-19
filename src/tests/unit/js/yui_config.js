YUI_config = {
    groups: {
        // css development files
        'spinjs-css': {
            base: '../../css/',
            modules: {
                'spinjs-csscombo': {
                    path: 'combo.css',
                    type: 'css'
                },
                'spinjs-csscore': {
                    path: 'spin.css',
                    requires: ['spinjs-csscombo'],
                    type: 'css'
                }
            }
        },
        // javascript development files
        'spinjs-js': {
            base: '../../js/',
            modules: {
                'spinjs-utils': {
                    path: 'utils.js'
                },
                'spinjs-config': {
                    path: 'config.js',
                    requires: ['spinjs-utils']
                },
                'spinjs-panel': {
                    path: 'panel.js'
                },
                'spinjs-core': {
                    path: 'spin.js',
                    requires: [
                        'spinjs-csscore',
                        'spinjs-utils',
                        'spinjs-config',
                        'spinjs-panel'
                    ]
                }
            }
        },
        // tests files
        'spinjs-tests': {
            base: './js/',
            modules: {
                'onload-tests': {
                    path: 'onload-tests.js',
                    requires: ['test', 'node', 'spinjs-core']
                },
                'utils-tests': {
                    path: 'utils-tests.js',
                    requires: ['test', 'node', 'spinjs-utils']
                },
                'config-tests': {
                    path: 'config-tests.js',
                    requires: ['test', 'node', 'spinjs-config']
                }
            }
        }
    }
};