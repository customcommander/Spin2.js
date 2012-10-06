function triggerEvent(type, el) {
    var ev = document.createEvent('Event');
    ev.initEvent(type, true, true);
    el.dispatchEvent(ev);
}

function click(elt) {
    triggerEvent('click', elt);
}

function clickNav(elt) {
    if (typeof elt == 'string') {
        elt = document.getElementById(elt);
    }
    if (elt) {
        elt.classList.remove('loaded');
        click(elt);
    }
}

function getClass(o) {
    var cls;
    cls = Object.prototype.toString.call(o);
    cls = cls.slice(cls.indexOf(' ')+1, -1); //[object FooBar] => Foobar
    return cls.toLowerCase();
}

// Designed to be used by waitsFor blocks
function pause(time) {
    var t = Date.now();
    return function () {
        return (Date.now() - t) >= time;
    };
}

var AppHelper = {
    restart: function () {
        var panels = document.getElementById('spin-panels');
        while (panels.lastChild) {
            panels.removeChild(panels.lastChild);
        }
        spin.loader()(document.body);
    },
    clickNav: function (elt) {
        elt = document.getElementById(elt);
        if (!elt) {
            throw new Error('element not found');
        }
        elt.classList.remove('loaded');
        click(elt);
    }
};

var PanelHelper = {
    getTitle: function (panel) {
        return panel.querySelector('.spin-title').innerHTML;
    },
    getContent: function (panel) {
        return panel.querySelector('.spin-panel-bd').innerHTML;
    }
};

var DomHelper = {

    /**
     * Makes sure that element has the given css classes
     * @param {HTMLElement} el HTML element to check
     * @param {Array} cls Array of css classes
     * @param {Boolean} [strict=false] If set to true check that el has all and only the given classes
     */
    hasClass: function (el, cls, strict) {
        function check(c) {
            return el.classList.contains(c);
        }

        if (cls.every(check)) {
            return !strict || cls.length === el.classList.length;
        }

        return false;
    }
};

beforeEach(function () {
    
    this.addMatchers({
        toBeFunction: function () {
            return getClass(this.actual) === 'function';
        },
        toBePanel: function () {
            return getClass(this.actual) === 'htmllielement' &&
                this.actual.classList.contains('spin-panel');
        },
        toBecomeSmall: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-small'], true);
        },
        toBecomeBig: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-big'], true);
        },
        toBecomeFull: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-full'], true);
        },
        toBecomeHiddenLeft: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-hiddenleft'], true);
        },
        toBecomeHiddenRight: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-hiddenright'], true);
        },
        toBeSmall: function () {
            return DomHelper.hasClass(this.actual, ['spin-panel', 'spin-small'], true);
        },
        toBeBig: function () {
            return DomHelper.hasClass(this.actual, ['spin-panel', 'spin-big'], true);
        },
        toBeFull: function () {
            return DomHelper.hasClass(this.actual, ['spin-panel', 'spin-full'], true);
        },
        toBeHiddenLeft: function () {
            return DomHelper.hasClass(this.actual, ['spin-panel', 'spin-hiddenleft'], true);
        },
        toBeHiddenRight: function () {
            return DomHelper.hasClass(this.actual, ['spin-panel', 'spin-hiddenright'], true);
        }
    });
});
