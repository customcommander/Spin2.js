YUI.add('unit-config-tests', function (Y) {

var suite = new Y.Test.Suite("config tests");

suite.add(new Y.Test.Case({

    name: "configuration properties - smoke tests",

    _should: {
        // temporary! phantomjs runs a webkit engine and the current css animations only support firefox
        ignore: {
            "title: should default to an empty string if not given": Y.UA.phantomjs,
            "content: should default to an empty string if not given": Y.UA.phantomjs
        }
    },

    /**
     * @param {Object} [cfg] Configuration object that will be given to `spin()`.
     * @return {Function} Returns a function that will make a call to `spin()` with the provided config object.
     */
    makeABadCall: function (cfg) {
        return function () {
            spin(cfg);
        };
    },

    setUp: function () {
        Y.helpers.removeAllPanels();
    },

    "title: should default to an empty string if not given": function () {

        var self = this;

        function assertPanelTitleIsEmpty(panel) {
            var title = Y.helpers.getPanelTitle(panel);
            self.resume(function () {
                Y.Assert.areSame('', title);
            });
        }

        Y.helpers.loadPanel({})().then(assertPanelTitleIsEmpty);
        this.wait();
    },

    "content: should default to an empty string if not given": function () {

        var self = this;

        function assertPanelContentIsEmpty(panel) {
            var content = Y.helpers.getPanelContent(panel);
            self.resume(function () {
                Y.Assert.areSame('', content);
            });
        }

        Y.helpers.loadPanel({})().then(assertPanelContentIsEmpty);
        this.wait();
    },

    "title: should throw an error if not valid": function () {
        Y.Assert.throwsError(Error, this.makeABadCall({ title: [] }), 'expected an array not to be a valid title');
        Y.Assert.throwsError(Error, this.makeABadCall({ title: {} }), 'expected an object not to be a valid title');
        Y.Assert.throwsError(Error, this.makeABadCall({ title: 99 }), 'expected a number not to be a valid title');
    },

    "content: should throw an error if not valid": function () {
        Y.Assert.throwsError(Error, this.makeABadCall({ content: [] }), 'expected an array not to be a valid content');
        Y.Assert.throwsError(Error, this.makeABadCall({ content: {} }), 'expected an object not to be a valid content');
        Y.Assert.throwsError(Error, this.makeABadCall({ content: 99 }), 'expected a number not to be a valid content');
    },

    "url: should throw if not valid": function () {
        Y.Assert.throwsError(Error, this.makeABadCall({ url: [] }), 'expected an array not to be a valid url');
        Y.Assert.throwsError(Error, this.makeABadCall({ url: 99 }), 'expected a number not to be a valid url');
        Y.Assert.throwsError(Error, this.makeABadCall({ url: ''}) , 'expected an empty string not to be a valid url');
        Y.Assert.throwsError(Error, this.makeABadCall({ url: ' '}), 'expected a white spaces only string not to be a valid url');
    },

    "panel: should throw if not valid": function () {
        Y.Assert.throwsError(Error, this.makeABadCall({ panel: [] })  , 'expected an array not to be a valid value for panel');
        Y.Assert.throwsError(Error, this.makeABadCall({ panel: true }), 'expected a boolean not to be a valid value for panel');
        Y.Assert.throwsError(Error, this.makeABadCall({ panel: 9999 }), 'expected an error to be thrown if panel is out of range');
    },

    "error: should throw if not valid": function () {
        Y.Assert.throwsError(Error, this.makeABadCall({ error: [] }), 'expected an array not to be a valid value for error');
        Y.Assert.throwsError(Error, this.makeABadCall({ error: 99 }), 'expected a number not to be a valid value for error');
    }
}));

Y.Test.Runner.add(suite);

});