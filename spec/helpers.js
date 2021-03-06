// A non destructive way to spy on spin.
// When doing a classic spyOn(window, 'spin')
// it will remove every other static functions attached to it
// like spin.getPanel, spin.moveTo, etc.
function spinSpy() {
    var spy, copy = spin;
    spy = spyOn(window, 'spin');
    Object.keys(copy).forEach(function (key) {
        spy[key] = copy[key];
    });
    return spy;
}

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

    // all css classes that trigger an animation
    // when applied on a panel node.
    cssAnim: [
        'spin-small-hiddenleft',
        'spin-hiddenleft-small',
        'spin-big-hiddenleft',
        'spin-hiddenleft-big',
        'spin-full-hiddenleft',
        'spin-hiddenleft-full',
        'spin-small-hiddenright',
        'spin-hiddenright-small',
        'spin-big-hiddenright',
        'spin-hiddenright-big',
        'spin-full-hiddenright',
        'spin-hiddenright-full',
        'spin-big-small',
        'spin-small-big',
        'spin-full-small',
        'spin-small-full'
    ],

    restart: function () {
        var panels = document.getElementById('spin-panels');
        var crumbs = document.getElementById('spin-nav');
        while (crumbs.lastChild) {
            crumbs.removeChild(crumbs.lastChild);
        }
        while (panels.lastChild) {
            panels.removeChild(panels.lastChild);
        }
        spin({
            url: document.body.dataset.url,
            title: document.body.dataset.title
        });
    },

    clear: function () {
        var panels = document.getElementById('spin-panels'),
            nav = document.getElementById('spin-nav');
        while (nav.lastChild) {
            nav.removeChild(nav.lastChild);
        }
        while (panels.lastChild) {
            panels.removeChild(panels.lastChild);
        }
    },

    // Returns the home panel (i.e. the first panel)
    getHome: function () {
        return document.getElementById('spin-panels').firstChild;
    },

    clickNav: function (elt) {
        elt = document.getElementById(elt);
        if (!elt) {
            throw new Error('element not found');
        }
        elt.classList.remove('loaded');
        click(elt);
    },

    // Returns true when no panel is moving
    notMoving: function () {
        // all panel nodes
        var p = document.getElementById('spin-panels').childNodes;
        var i, n;
        var css = AppHelper.cssAnim;

        // Checks whether panel node contains given css class
        // this object is set to a panel node
        function isPresent(c) {
            return this.classList.contains(c);
        }

        // We check for each panel that none of them
        // has a css animation class in their class attribute
        // If one of them has then it means that an animation is running
        // and therefore that the app is moving.
        for (i=0, n=p.length; i<n; i++) {
            if ( css.some(isPresent, p[i]) ) {
                return false;
            }
        }

        // At this point we're sure that no panel is moving at all.
        return true;
    }
};

var PanelHelper = {
    getTitle: function (panel) {
        return panel.querySelector('.spin-title').innerHTML;
    },
    getContent: function (panel) {
        return panel.querySelector('.spin-panel-bd').innerHTML;
    },
    getBreadCrumb: function (panel) {
        return document.getElementById(panel.id + '-crumb').innerHTML;
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
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-small'], false);
        },
        toBecomeBig: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-big'], false);
        },
        toBecomeFull: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-full'], false);
        },
        toBecomeHiddenLeft: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-hiddenleft'], false);
        },
        toBecomeHiddenRight: function (curState) {
            return DomHelper.hasClass(this.actual, ['spin-panel', curState, curState + '-hiddenright'], false);
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
