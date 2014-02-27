YUI.add('functional-navclick-tests', function (Y) {

var suite = new Y.Test.Suite('nav items clicks tests');

suite.add(new Y.Test.Case({

    name: "click on non navigable elements",

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    clickNonNav: function () {
        Y.one('.spin-items').simulate('click'); // see tubemap.html
        return new Y.Promise(function (resolve) {
            Y.later(20, null, resolve);
        });
    },

    initTest: function () {
        return Y.helpers.loadPanel({ url: './assets/panels/tubemap.html' })()
            .then(Y.helpers.waitUntilNothingMoves)
            .then(this.clickNonNav);
    },

    "should not load anything": function () {

        this.initTest().then(Y.bind(function () {
            this.resume(function () {
                Y.Assert.areSame(1, Y.all('.spin-panel').size());
            });
        }, this));

        this.wait();
    },

    "should not move the panel": function () {

        this.initTest().then(Y.bind(function () {
            this.resume(function () {
                var panel = Y.one(spin.getPanel(0));
                Y.Assert.areSame('0px', panel.getComputedStyle('left'));
                Y.Assert.areSame('0px', panel.getComputedStyle('right'));
            });
        }, this));

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: "click on a non loaded navigable element",

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    clickOnNav: function () {
        Y.one('#piccadilly').simulate('click');
        return new Y.Promise(function (resolve) {
            Y.later(20, null, resolve);
        });
    },

    initTest: function () {
        return Y.helpers.loadPanel({ url: './assets/panels/tubemap.html' })()
            .then(Y.helpers.waitUntilNothingMoves)
            .then(this.clickOnNav);
    },

    "should load a panel": function () {

        this.initTest().then(Y.bind(function () {
            this.resume(function () {
                Y.Assert.areSame(2, Y.all('.spin-panel').size());
            });
        }, this));

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});