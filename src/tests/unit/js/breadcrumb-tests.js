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
        // temporary.
        // when webkit is supported, delete this.
        ignore: {
            "crumb1: applied to the last panel if it is not visible": Y.UA.phantomjs,
            "crumb2: applied to a panel that is not visible and which next sibling isn't either": Y.UA.phantomjs,
            "crumb3: applied to a panel that is not visible but which next sibling is": Y.UA.phantomjs,
            "crumb4: applied to the last panel if it is visible": Y.UA.phantomjs,
            "crumb5: applied to a panel that is visible and which next sibling is": Y.UA.phantomjs,
            "crumb6: applied to a panel that is visible but which next sibling isn't": Y.UA.phantomjs
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
    },

    "crumb2: applied to a panel that is not visible and which next sibling isn't either": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.loadPanel())
            .then(function () {
                self.resume(function () {
                    var crumb = self.getBreadcrumb(spin.getPanel(0));
                    Y.Assert.areSame('crumb2', crumb.className);
                });
            });

        this.wait();
    },

    "crumb3: applied to a panel that is not visible but which next sibling is": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.loadPanel())
            .then(function () {
                self.resume(function () {
                    var crumb = self.getBreadcrumb(spin.getPanel(0));
                    Y.Assert.areSame('crumb3', crumb.className);
                });
            });

        this.wait();
    },

    "crumb4: applied to the last panel if it is visible": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.loadPanel())
            .then(function () {
                self.resume(function () {
                    var crumb = self.getBreadcrumb(spin.getPanel(1));
                    Y.Assert.areSame('crumb4', crumb.className);
                });
            });

        this.wait();
    },

    "crumb5: applied to a panel that is visible and which next sibling is": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.loadPanel())
            .then(function () {
                self.resume(function () {
                    var crumb = self.getBreadcrumb(spin.getPanel(0));
                    Y.Assert.areSame('crumb5', crumb.className);
                });
            });

        this.wait();
    },

    "crumb6: applied to a panel that is visible but which next sibling isn't": function () {

        var self = this;

        Y.helpers.loadPanel()()
            .then(Y.helpers.loadPanel())
            .then(Y.helpers.moveToPanel(0))
            .then(function () {
                self.resume(function () {
                    var crumb = self.getBreadcrumb(spin.getPanel(0));
                    Y.Assert.areSame('crumb6', crumb.className);
                });
            });

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});