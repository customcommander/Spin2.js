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
     * Returns a function that loads a panel and returns a `Promise` that automatically
     * resolves when the panel is loaded and doesn't move.
     *
     * @param {Object} [cfg] A config object that will be given to `spin()`.
     * @return {Function}
     */
    loadPanel: function (cfg) {
        return function () {
            var panel = spin(cfg);
            return new Y.Promise(function (resolve) {
                Y.helpers.waitUntilNothingMoves().then(function () {
                    resolve(panel);
                });
            });
        };
    },

    /**
     * Returns a function that returns a Promise to move to given panel.
     * The Promise resolves when we reached out the panel.
     * @param {Number|String|HTMLElement} el
     * @return {Function}
     */
    moveToPanel: function (el) {
        return function () {
            var panel = spin.moveTo(el);
            return new Y.Promise(function (resolve) {
                Y.helpers.waitUntilNothingMoves().then(function () {
                    resolve(panel);
                });
            });
        };
    },

    /**
     * Helper that returns the title of given panel.
     * @param {HTMLElement} panel
     * @return {String}
     */
    getPanelTitle: function (panel) {
        return panel.querySelector('.spin-title').textContent;
    },

    /**
     * Helper that returns the content of given panel.
     * @param {HTMLElement} panel
     * @return {String}
     */
    getPanelContent: function (panel) {
        return panel.querySelector('.spin-panel-bd').innerHTML;
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