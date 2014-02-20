YUI.add('onload-tests', function (Y) {

var suite = new Y.Test.Suite('onload tests');

suite.add(new Y.Test.Case({

    name: "when the page loads",

    "the first panel should load": function () {
        this.wait(function () {
            Y.Assert.isNotNull( Y.one('.spin-panel') );
        }, 1000);
    },

    "there should be only one panel": function () {
        this.wait(function () {
            Y.Assert.areSame(1, Y.all('.spin-panel').size());
        }, 1000);
    },

    "the first panel should take all the available space": function () {
        this.wait(function () {
            var body  = Y.one('body'), panel = Y.one('.spin-panel');
            Y.Assert.areSame(body.getComputedStyle('width'), panel.getComputedStyle('width'));
        }, 1000);
    }
}));

Y.Test.Runner.add(suite);

});