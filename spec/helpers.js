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

beforeEach(function () {
    
    this.addMatchers({
        toBeFunction: function () {
            return getClass(this.actual) === 'function';
        },
        toBePanel: function () {
            return getClass(this.actual) === 'htmllielement' &&
                this.actual.classList.contains('spin-panel');
        }
    });
});
