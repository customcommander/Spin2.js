
var toString = Object.prototype.toString;

// Returns true if o is undefined
function isUndefined(o) {
    return o === undefined;
}

// Returns true if o is a boolean
function isBoolean(o) {
    return toString.call(o) == '[object Boolean]';
}

// Returns true if o is a finite number
function isNumber(o) {
    return toString.call(o) == '[object Number]' && isFinite(o);
}

// Returns true if o is an object
function isObject(o) {
    return toString.call(o) == '[object Object]';
}

// Returns true if o is a string
function isString(o) {
    return toString.call(o) == '[object String]';
}

// Returns true if o is a html element
function isElement(o) {
    return !!o && o.nodeType === 1;
}

// Returns true if o is a panel
function isPanel(o) {
    return !!o && o.parentNode.id === 'spin-panels';
}

// Returns true if o is a breadcrumb
function isBreadCrumb(o) {
    return !!o && o.parentNode === document.querySelector('#spin-nav');
}

// Looks for the nav element that contains el and returns it.
// Returns null if not found.
function getNav(el) {
    if (!isElement(el)) {
        return null;
    }
    do {
        // only element nodes have a classList property
        if (isElement(el) && el.classList.contains('nav')) {
            return el;
        }
        el = el.parentNode;
    } while (el);
    return null;
}
