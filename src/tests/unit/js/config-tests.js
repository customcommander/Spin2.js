YUI.add('unit-config-tests', function (Y) {

var suite = new Y.Test.Suite("config tests");

suite.add(new Y.Test.Case({

    name: "configuration properties - error check",

    "title: should throw an error if it is not a string": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ title: [] });
        });
    },

    "content: should throw an error if it is not a string": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ content: [] });
        });
    },

    "url: should throw an error if it is not a string": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ url: [] });
        });
    },

    "url: should throw an error if it is empty": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ url: "" });
        });
    },

    "url: should throw an error if it contains white spaces only": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ url: "\t\t\t" });
        });
    },

    "panel: should throw if it is not a number": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ panel: [] });
        });
    },

    "panel: should throw if it is out of range": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ panel: 9999 });
        });
    },

    "error: should throw if it is not a boolean": function () {
        Y.Assert.throwsError(Error, function () {
            spin({ error: [] });
        });
    }
}));

Y.Test.Runner.add(suite);

});