YUI.add('unit-utils-tests', function (Y) {

var suite = new Y.Test.Suite('utils tests');

suite.add(new Y.Test.Case({

    "test: isUndefined()": function () {
        var und;
        Y.Assert.isTrue(isUndefined(und)   , 'undefined should be undefined');
        Y.Assert.isTrue(isUndefined()      , 'a parameter not given should default to undefined');
        Y.Assert.isFalse(isUndefined(null) , 'null is not undefined');
    },

    "test: isBoolean() returns true for real booleans": function () {
        Y.Assert.isTrue(isBoolean(true) , 'expected true to be a valid boolean');
        Y.Assert.isTrue(isBoolean(false), 'expected false to be a valid boolean');
    },

    "test: isBoolean() returns false for falsy or thruthy values": function () {
        Y.Assert.isFalse(isBoolean(0)        , '0 is not a boolean');
        Y.Assert.isFalse(isBoolean(1)        , '1 is not a boolean');
        Y.Assert.isFalse(isBoolean('')       , 'an empty string is not a boolean');
        Y.Assert.isFalse(isBoolean("foo")    , 'a non empty string is not a boolean');
        Y.Assert.isFalse(isBoolean(null)     , 'null is not boolean');
        Y.Assert.isFalse(isBoolean(undefined), 'undefined is not a boolean');
    },

    "test: isNumber() returns true for real numbers": function () {
        Y.Assert.isTrue(isNumber(-1.1), 'expected -1.1 to be valid number');
        Y.Assert.isTrue(isNumber(0)   , 'expected 0 to be a valid number');
        Y.Assert.isTrue(isNumber(1.1) , 'expected 1.1 to be a valid number');
    },

    "test: isNumber() doesn't do type coercion": function () {
        Y.Assert.isFalse(isNumber('-1.1'), 'expected "-1" not to be a number');
        Y.Assert.isFalse(isNumber('0')   , 'expected "0" not to be a number');
        Y.Assert.isFalse(isNumber('1.1') , 'expected "-1.1" not to be a number');
    },

    "test: isNumber() rejects 'funny numbers'": function () {
        Y.Assert.isFalse(isNumber(NaN)      , 'expected NaN not to be a number');
        Y.Assert.isFalse(isNumber(Infinity) , 'expected Infinity not to be a number');
        Y.Assert.isFalse(isNumber(-Infinity), 'expected -Infinity not to be a number');
    },

    "test: isObject()": function () {
        function foo() {}
        Y.Assert.isTrue(isObject({})       , 'expected {} to be an object');
        Y.Assert.isTrue(isObject(new foo()), 'expected new foo() to be an object');
        Y.Assert.isFalse(isObject([])      , 'expected an array not be an object')
        Y.Assert.isFalse(isObject(null)    , 'expected null not be an object')
    },

    "test: isString()": function () {
        Y.Assert.isTrue(isString('')   , 'expected an empty string to be a string');
        Y.Assert.isTrue(isString('  ') , 'expected a white space string to be a string');
        Y.Assert.isTrue(isString('foo'), 'expected a non empty string to be a string');
        Y.Assert.isFalse(isString([])  , 'expected an array not to be a string');
    },

    "test: isElement()": function () {
        Y.Assert.isTrue(isElement(document.body), 'expected document.body to be an element');
        Y.Assert.isFalse(isElement({})          , 'expected {} not to be an element');
    },

    "test: isPanel()": function () {
        Y.one('body').append(
            '<div id="test">' +
                '<div id="spin-panels">' +
                    '<div id="panel1" class="spin-panel"></div>' +
                    '<div id="panel2"></div>' +
                '</div>' +
                '<div id="foo"></div>' +
            '</div>');
        Y.Assert.isTrue(isPanel(Y.one('#panel1').getDOMNode()), 'expected #panel1 to be a panel');
        Y.Assert.isFalse(isPanel(Y.one('#foo').getDOMNode())  , 'expected #foo not to be a panel');
        Y.one('#test').remove();
    },

    "test: isBreadCrumb()": function () {
        Y.one('body').append(
            '<div id="test">' +
                '<div id="spin-nav">' +
                    '<div id="foo"></div>' +
                '</div>' +
                '<div id="bar"></div>' +
            '</div>');
        Y.Assert.isTrue(isBreadCrumb(Y.one('#foo').getDOMNode()) , 'expected #foo to be a bread crumb');
        Y.Assert.isFalse(isBreadCrumb(Y.one('#bar').getDOMNode()), 'expected #bar not be a bread crumb');
        Y.one('#test').remove();
    },

    "test: getNav()": function () {
        Y.one('body').append(
            '<div id="out">' +
                '<div id="nav" class="nav">' +
                    '<ol>' +
                        '<li>' +
                            '<p id="in">...</p>' +
                        '</li>' +
                    '</ol>' +
                '</div>' +
            '</div>');

        Y.Assert.areSame( Y.one('#nav').getDOMNode(), getNav( Y.one('#nav').getDOMNode() ) );
        Y.Assert.areSame( Y.one('#nav').getDOMNode(), getNav( Y.one('#in').getDOMNode() ) );
        Y.Assert.isNull( getNav( Y.one('#out').getDOMNode() ) );
        Y.Assert.isNull( getNav( {} ) );

        Y.one('#out').remove();
    }
}));

Y.Test.Runner.add(suite);

});