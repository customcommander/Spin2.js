YUI.add('functional-onload-tests', function (Y) {

var suite = new Y.Test.Suite('onload tests');

suite.add(new Y.Test.Case({

    name: "when the page loads",

    "the first panel should load": function () {
        var self = this;
        Y.helpers.waitUntilNothingMoves().then(function () {
            self.resume(function () {
                Y.Assert.isNotNull(Y.one('.spin-panel'));
            });
        });
        this.wait();
    },

    "there should be only one panel": function () {
        var self = this;
        Y.helpers.waitUntilNothingMoves().then(function () {
            self.resume(function () {
                Y.Assert.areSame(1, Y.all('.spin-panel').size());
            });
        });
        this.wait();
    },

    "the first panel should take all the available space": function () {
        var self = this;
        Y.helpers.waitUntilNothingMoves().then(function () {
            self.resume(function () {
                var body = Y.one('body'), panel = Y.one('.spin-panel');
                Y.Assert.areSame(body.getComputedStyle('width'), panel.getComputedStyle('width'));
            });
        });
        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});