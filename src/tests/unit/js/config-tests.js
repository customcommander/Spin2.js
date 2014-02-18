YUI.add('config-tests', function (Y) {

var suite = new Y.Test.Suite("config tests");

suite.add(new Y.Test.Case({

    name: "config()",

    "returns an object": function () {
        Y.one('body').append('<div id="foo"></div>');
        Y.Assert.isObject( config() );
        Y.Assert.isObject( config( Y.one('#foo').getDOMNode() ) );
        Y.Assert.isObject( config( {} ) );
        Y.one('#foo').remove();
    }
}));

suite.add(new Y.Test.Case({

    name: "config.get()",

    "reads the d  ata-url attribute from the element": function () {
        var cfg;
        Y.one('body').append('<div id="nav" data-url="this_url"></div>');
        cfg = config.get( Y.one('#nav').getDOMNode() );
        Y.Assert.areSame('this_url', cfg.url);
        Y.one('#nav').remove();
    },

    "reads the data-title attribute from the element": function () {
        var cfg;
        Y.one('body').append('<div id="nav" data-title="this_title"></div>');
        cfg = config.get( Y.one('#nav').getDOMNode() );
        Y.Assert.areSame('this_title', cfg.title);
        Y.one('#nav').remove();
    }
}));

suite.add(new Y.Test.Case({

    name: "config.validate()",

    "returns an object": function () {
        Y.Assert.isObject(config.validate({}));
    },

    "throws if cfg is not an object": function () {
        Y.Assert.throwsError(Error, function () {
            config.validate();
        });
    },

    "throws if cfg.title is not a string": function () {
        Y.Assert.throwsError(Error, function () {
            config.validate({ title: [] });
        });
    },

    "throws if cfg.content is not a string": function () {
        Y.Assert.throwsError(Error, function () {
            config.validate({ content: [] });
        });
    },

    "throws if cfg.url is not valid": function () {
        Y.Assert.throwsError(Error, function () {
            config.validate({ url: [] });
        });
        Y.Assert.throwsError(Error, function () {
            config.validate({ url: '' });
        });
        Y.Assert.throwsError(Error, function () {
            config.validate({ url: '  ' });
        });
    },

    "throws if cfg.panel is not valid": function () {
        Y.Assert.throwsError(Error, function () {
            config.validate({ panel: [] });
        });
    },

    "throws if cfg.error is not valid": function () {
        Y.Assert.throwsError(Error, function () {
            config.validate({ error: [] });
        });
    }
}));

suite.add(new Y.Test.Case({

    name: "config.defaults(cfg)",

    "adds default values if they are not present": function () {
        var cfg = {};
        cfg = config.defaults(cfg);
        Y.ObjectAssert.ownsKeys(['title','content','error'], cfg, 'some default values have not been added');
        Y.Assert.areSame(''   , cfg.title  , 'expected default value for title to be an empty string');
        Y.Assert.areSame(''   , cfg.content, 'expected default value for content to be an empty string');
        Y.Assert.areSame(false, cfg.error  , 'expected default value for error to be false');
    },

    "do not touch existing values": function () {
        var cfg = { title: 'aa', content: 'bb', error: true };
        cfg = config.defaults(cfg);
        Y.Assert.areSame('aa', cfg.title  , 'expected cfg.title to be "aa"');
        Y.Assert.areSame('bb', cfg.content, 'expected cfg.content to be "bb"');
        Y.Assert.areSame(true, cfg.error  , 'expected cfg.error to be true')
    }
}));

Y.Test.Runner.add(suite);

});