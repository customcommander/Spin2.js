YUI.add('unit-getpanel-tests', function (Y) {

var suite = new Y.Test.Suite('spin.getPanel() tests');

suite.add(new Y.Test.Case({

    name: "spin.getPanel()",

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    destroy: function () {
        Y.helpers.removeAllPanels();
    },

    _panelExists: function () {
        return Y.one('.spin-panel');
    },

    "returns the panel at given index": function () {
        var panel = spin();
        this.waitFor(this._panelExists, function () {
            Y.Assert.areSame(panel, spin.getPanel(0));
        });
    },

    "throws an error if index is out of range": function () {
        spin();
        this.waitFor(this._panelExists, function () {
            Y.Assert.throwsError(Error, function () {
                // there is no way we have 1000 panels right now...
                spin.getPanel(999);
            });
        });
    },

    "returns the panel that contains an element matching given css selector": function () {
        var panel = spin({ content: '<p id="foo" class="bar">bar</p>' });
        this.waitFor(this._panelExists, function () {
            Y.Assert.areSame(panel, spin.getPanel('#foo.bar'));
        });
    },

    "returns the panel matching given css selector": function () {
        var panel = spin();
        this.waitFor(this._panelExists, function () {
            Y.Assert.areSame(panel, spin.getPanel('#'+panel.id));
        });
    },

    "throws an error if given html id does not exist": function () {
        spin();
        this.waitFor(this._panelExists, function () {
            Y.Assert.throwsError(Error, function () {
                spin.getPanel('unknown_html_id');
            });
        });
    },

    "throws an error if given html id exists but is not contained within a panel": function () {
        Y.Node.create('<div id="not_in_a_panel"></div>').appendTo('body');
        spin();
        this.waitFor(this._panelExists, function () {
            Y.Assert.throwsError(Error, function () {
                spin.getPanel('not_in_a_panel');
            });
        });
    },

    "returns the panel that contains given html element": function () {
        var panel = spin({ content: '<p id="hello">world</p>' });
        this.waitFor(this._panelExists, function () {
            var el = Y.one('#hello').getDOMNode();
            Y.Assert.areSame(panel, spin.getPanel(el));
        });
    },

    "returns the panel if a panel is given": function () {
        var panel = spin();
        this.waitFor(this._panelExists, function () {
            Y.Assert.areSame(panel, spin.getPanel(panel));
        });
    },

    "throws an error if given html element is not contained within a panel": function () {
        spin();
        this.waitFor(this._panelExists, function () {
            Y.Assert.throwsError(Error, function () {
                spin.getPanel(document.body);
            });
        });
    },

    "throws an error if argument is invalid": function () {
        Y.Assert.throwsError(Error, function () { spin.getPanel(); });
        Y.Assert.throwsError(Error, function () { spin.getPanel([]); });
        Y.Assert.throwsError(Error, function () { spin.getPanel({}); });
        Y.Assert.throwsError(Error, function () { spin.getPanel(true); });
        Y.Assert.throwsError(Error, function () { spin.getPanel(NaN); });
    }
}));

Y.Test.Runner.add(suite);

});