YUI.add('unit-breadcrumb-tests', function (Y) {

var suite = new Y.Test.Suite('breadcrumb tests');

suite.add(new Y.Test.Case({

    name: "when you add a panel",

    _should: {
        ignore: {
            "there should be a corresponding breadcrumb": Y.UA.phantomjs,
            "the number of panels and breadcrumbs should be the same": Y.UA.phantomjs
        }
    },

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    destroy: function () {
        Y.helpers.removeAllPanels();
    },

    "there should be a corresponding breadcrumb": function () {

        var self = this;

        function assertBreadcrumbExists(panel) {
            var id = panel.id + '-crumb';
            self.resume(function () {
                Y.Assert.isNotNull(Y.one('#'+id));
            });
        }

        Y.helpers.loadPanel()().then(assertBreadcrumbExists);
        this.wait();
    },

    "the number of panels and breadcrumbs should be the same": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.loadPanel())
            .then(function () {
                self.resume(function () {
                    var panels = Y.one('#spin-panels'), nav = Y.one('#spin-nav');
                    Y.Assert.areSame(panels.get('children').size(), nav.get('children').size());
                });
            });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: "breadcrumb states",

    _should: {
        ignore: {
            "crumb1: applied to the last panel if it is not visible": true
        }
    },

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    destroy: function () {
        Y.helpers.removeAllPanels();
    },

    getBreadcrumb: function (panel) {
        return Y.one('#' + panel.id + '-crumb').getDOMNode();
    },

    "crumb1: applied to the last panel if it is not visible": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.moveToPanel(0))
            .then(function () {
                self.resume(function () {
                    var crumb = self.getBreadcrumb(spin.getPanel(1));
                    Y.Assert.areSame('crumb1', crumb.className);
                });
            });

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});