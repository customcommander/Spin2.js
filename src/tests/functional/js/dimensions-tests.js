YUI.add('functional-dimensions-tests', function (Y) {

var suite = new Y.Test.Suite('dimensions tests');

suite.add(new Y.Test.Case({

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    "when the home panel loads, it takes all the available space": function () {
        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.waitUntilNothingMoves)
            .then(function () {

                var panel,
                    panel_width,
                    win_width;

                panel = spin.getPanel(0);
                panel = Y.one(panel);

                panel_width = parseInt(panel.getComputedStyle('width'), 10);
                win_width   = Y.one(panel).get('winWidth');

                self.resume(function () {
                    Y.Assert.isTrue(panel_width === win_width);
                });
            });

        this.wait();
    },

    "when a panel loads it takes 2/3 of the available space": function () {

        var self  = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.waitUntilNothingMoves)
            .then(function () {
                var panel,
                    panel_width,
                    win_width,
                    expected_width;

                panel = spin.getPanel(1);
                panel = Y.one(panel);

                panel_width    = parseInt(panel.getComputedStyle('width'), 10);
                win_width      = panel.get('winWidth');
                expected_width = (win_width / 3) * 2;

                self.resume(function () {
                    // allows a 10px margin to account for scrollbars and other quirkiness
                    Y.Assert.isTrue(expected_width-10<panel_width && panel_width<expected_width+10);
                });
            });

        this.wait();
    },

    "when a panel loads, the previous panel takes 1/3 of the available space": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.waitUntilNothingMoves)
            .then(function () {

                var panel,
                    panel_width,
                    win_width,
                    expected_width;

                panel = spin.getPanel(0);
                panel = Y.one(panel);

                panel_width    = parseInt(panel.getComputedStyle('width'), 10);
                win_width      = panel.get('winWidth');
                expected_width = win_width / 3;

                self.resume(function () {
                    // allows a 10px margin to account for scrollbars and other quirkiness
                    Y.Assert.isTrue(expected_width-10<panel_width && panel_width<expected_width+10);
                });
            });

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});