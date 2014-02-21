YUI.add('unit-breadcrumb-tests', function (Y) {

var suite = new Y.Test.Suite('breadcrumb tests');

suite.add(new Y.Test.Case({

    name: "breadcrumb(id, title)",

    "should return an element": function () {
        var el = breadcrumb('id01', 'title_for_01');
        Y.Assert.isTrue(el.nodeType === Node.ELEMENT_NODE, 'expected an element node');
    },

    "should add an id": function () {
        var el = Y.one( breadcrumb('id02', 'title_for_02') );
        Y.Assert.isTrue(el.hasAttribute('id')                , 'there is not id attribute');
        Y.Assert.areSame('id02-crumb', el.getAttribute('id') , 'the id attribute is not valid');
    },

    "should add a css class": function () {
        var el = Y.one( breadcrumb('id03', 'title_for_03') );
        Y.Assert.isTrue(el.hasAttribute('class'), 'there is no css class');
        Y.Assert.isTrue(el.hasClass('crumb4')   , 'css class should be crumb4');
    },

    "should set the content to title": function () {
        var el = breadcrumb('id04', 'title_for_04');
        Y.Assert.isNotNull(el.firstChild                         , 'breadcrumb is empty');
        Y.Assert.isTrue(el.firstChild.nodeType === Node.TEXT_NODE, 'breadcrumb content is not text');
        Y.Assert.areSame('title_for_04', el.firstChild.nodeValue , 'breadcrumb text is wrong');
    }
}));

Y.Test.Runner.add(suite);

});