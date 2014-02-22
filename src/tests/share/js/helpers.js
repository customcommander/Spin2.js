YUI.add('helpers-for-tests', function (Y) {

Y.helpers = {

    /**
     * Waits until no panels are moving.
     * @return {Promise} Resolve when no panels are moving.
     */
    waitUntilNothingMoves: function () {

        return new Y.Promise(function (resolve) {

            var wait,
                css_anims = [
                    'spin-small-hiddenleft',
                    'spin-hiddenleft-small',
                    'spin-big-hiddenleft',
                    'spin-hiddenleft-big',
                    'spin-full-hiddenleft',
                    'spin-hiddenleft-full',
                    'spin-small-hiddenright',
                    'spin-hiddenright-small',
                    'spin-big-hiddenright',
                    'spin-hiddenright-big',
                    'spin-full-hiddenright',
                    'spin-hiddenright-full',
                    'spin-big-small',
                    'spin-small-big',
                    'spin-full-small',
                    'spin-small-full'
                ];

            function isMoving() {
                return Y.all('.spin-panel').some(function (node) {
                    return Y.Array.some(css_anims, function (klass) {
                        return node.hasClass(klass);
                    });
                });
            }

            function check() {
                if (!isMoving()) {
                    wait.cancel();
                    resolve();
                }
            }

            wait = Y.later(50, null, check, [], true);
        });
    },

    /**
     * Helper to be used in a Promise chain.
     * @param {Object} [cfg] A config object that will be given to `spin()`.
     * @return {Function} A function that returns a Promise to load a panel.
     */
    loadPanel: function (cfg) {
        return function () {
            return new Y.Promise(function (resolve) {
                spin(cfg);
                resolve();
            });
        };
    },

    /**
     * Removes all panels.
     */
    removeAllPanels: function () {
        Y.one('#spin-panels').empty();
        Y.one('#spin-nav').empty();
    }
};

});