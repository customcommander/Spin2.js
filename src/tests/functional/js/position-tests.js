YUI.add('functional-position-tests', function (Y) {

var suite = new Y.Test.Suite('position tests');

suite.add(new Y.Test.Case({

    name: "home panel in view",

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    "the edges of the panel should be aligned with the edges of the viewport": function () {

        var self = this;

        Y.helpers.loadPanel()() // home panel, i.e. panel 0
            .then(Y.helpers.waitUntilNothingMoves)
            .then(function () {

                var panel = Y.one( spin.getPanel(0) );
                var left_pos  = parseInt(panel.getComputedStyle('left'), 10);
                var right_pos = parseInt(panel.getComputedStyle('right'), 10);

                self.resume(function () {
                    Y.Assert.areSame(0, left_pos , 'the left edge of the panel is not aligned with the viewport');
                    Y.Assert.areSame(0, right_pos, 'the right edge of the panel is not aligned with the viewport');
                });
            });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: "the first panel in view",

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    "its left edge should be aligned with the left edge of the viewport": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then( Y.helpers.waitUntilNothingMoves )
            .then( Y.helpers.loadPanel() )
            .then( Y.helpers.waitUntilNothingMoves )
            .then(function () {

                var panel = Y.one( spin.getPanel(0) );
                var left_pos = parseInt(panel.getComputedStyle('left'), 10);

                self.resume(function () {
                    Y.Assert.areSame(0, left_pos);
                });
            });

        this.wait();
    },

    "its right edge should be away from the right edge of the viewport by 2/3 of the viewport width": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then( Y.helpers.waitUntilNothingMoves )
            .then( Y.helpers.loadPanel() )
            .then( Y.helpers.waitUntilNothingMoves )
            .then(function () {

                var panel = Y.one( spin.getPanel(0) );
                var right_pos = parseInt(panel.getComputedStyle('right'), 10);
                var win_width = panel.get('winWidth');
                var expected_pos =  (win_width / 3) * 2;

                self.resume(function () {
                    Y.Assert.isTrue(expected_pos-20<right_pos && right_pos<expected_pos+20);
                });
            });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: "second panel in view",

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    "its left edge should be away from the left edge of the viewport by 1/3 of the viewport width": function () {

        var self = this;

        Y.helpers.loadPanel()()                       // panel 0
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())              // panel 1
            .then(Y.helpers.waitUntilNothingMoves)
            .then(function () {

                var panel = Y.one( spin.getPanel(1) );
                var left_pos = parseInt(panel.getComputedStyle('left'), 10);
                var win_width = panel.get('winWidth');
                var expected_pos = win_width / 3;

                self.resume(function () {
                    // allows an error margin to account for scroll bars and other quirkiness.
                    Y.Assert.isTrue(expected_pos-20<left_pos && left_pos<expected_pos+20);
                });
            });

        this.wait();
    },

    "the right edge of the panel should be aligned with the right edge of the viewport": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then( Y.helpers.waitUntilNothingMoves )
            .then( Y.helpers.loadPanel() )
            .then( Y.helpers.waitUntilNothingMoves )
            .then(function () {

                var panel = Y.one( spin.getPanel(1) );
                var right_pos = parseInt(panel.getComputedStyle('right'), 10);

                self.resume(function () {
                    Y.Assert.areSame(0, right_pos);
                });
            });

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});