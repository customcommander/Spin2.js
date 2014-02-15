YUI.add('onload-tests', function (Y) {

var suite = new Y.Test.Suite('on page load tests');

suite.add(new Y.Test.Case({

    "spin exposes its api": function () {
        Y.Assert.isFunction(window.spin         , 'spin() is not available');
        Y.Assert.isFunction(window.spin.getPanel, 'spin.getPanel() is not available');
        Y.Assert.isFunction(window.spin.moveTo  , 'spin.moveTo() is not available');
    },

    "spin drops its html markup": function () {
        var spin_node   = Y.one('#spin');
        var panels_node = Y.one('#spin-panels');
        var nav_node    = Y.one('#spin-nav');

        Y.Assert.isNotNull(spin_node                        , '#spin is not there');
        Y.Assert.isNotNull(panels_node                      , '#spin-panels is not there');
        Y.Assert.isNotNull(nav_node                         , '#spin-nav is not there');
        Y.Assert.areSame(2, spin_node.get('children').size(), '#spin should have two children');
        Y.Assert.isTrue(spin_node.contains(panels_node)     , '#spin should contain #spin-panels');
        Y.Assert.isTrue(spin_node.contains(nav_node)        , '#spin should contain #spin-nav');
    },

    "spin loads the first panel": function () {
        this.wait(function () {
            var panels_node = Y.one('#spin-panels');
            Y.Assert.areSame(1, panels_node.get('children').size(), 'looks like the first panel did not load');
        }, 100);
    }
}));


Y.Test.Runner.add(suite);

});