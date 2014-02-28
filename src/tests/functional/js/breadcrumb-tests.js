YUI.add('functional-breadcrumb-tests', function (Y) {

var suite = new Y.Test.Suite('breadcrumb tests');

suite.add(new Y.Test.Case({

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    "when a panel loads, a bread crumb should be added to the dom": function () {

        Y.helpers.loadPanel()()
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.bind(function () {
                this.resume(function () {
                    var nav = Y.one('#spin-nav');
                    Y.Assert.isTrue(nav.get('children').size()>0);
                });
            }, this));

        this.wait();
    },

    "the number of panels and breadcrumbs should be the same": function () {

        Y.helpers.loadPanel()()                    // panel 0
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())           // panel 1
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())           // panel 2
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())           // panel 3
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())           // panel 4
            .then(Y.bind(function () {

                this.resume(function () {

                    var panels = Y.one('#spin-panels'),
                        nav    = Y.one('#spin-nav');

                    Y.Assert.isTrue( panels.get('children').size() === nav.get('children').size() );
                });
            }, this));

        this.wait();
    },

    "if you click on a breadcrumb it should bring the corresponding panel into view": function () {

        // clicking on the first breadcrumb means that we want to bring the home
        // panel into view. when the first panel is brought into view it
        // must use all the available space.
        function clickOnTheFirstBreadCrumb() {
            Y.one('#spin-nav').get('children').item(0).simulate('click');
            return new Y.Promise(function (resolve) {
                Y.later(20, null, resolve);
            });
        }

        Y.helpers.loadPanel()()                      // panel 0
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())             // panel 1
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.helpers.loadPanel())             // panel 2, at this point panel 0 should be hidden
            .then(Y.helpers.waitUntilNothingMoves)
            .then(clickOnTheFirstBreadCrumb)
            .then(Y.helpers.waitUntilNothingMoves)
            .then(Y.bind(function () {

                this.resume(function () {
                    var first_panel = Y.one('#spin-panels').get('children').item(0);
                    Y.Assert.areSame('0px', first_panel.getComputedStyle('left'));
                    Y.Assert.areSame('0px', first_panel.getComputedStyle('right'));
                });
            }, this));

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});