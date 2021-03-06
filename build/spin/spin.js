/**
 * Spin.js - User Interface For Web Applications
 * @fileoverview This is the source code for Spin.js
 * @author Julien Gonzalez
 * @module spin
 */
(function (window, document) {


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

/**
 * Generates, validates and normalizes the panel configuration object.
 *
 * @class config
 * @constructor
 * @param {Object|HTMLElement} [o]
 * @return {Object} a configuration object.
 * @private
 */
function config(o) {
    var cfg;
    if (isUndefined(o)) { /*i.e. call with no argument*/
        cfg = {};
    } else if (isElement(o)) {
        cfg = config.get(o);
    } else {
        cfg = o;
    }
    cfg = config.validate(cfg);
    cfg = config.defaults(cfg);
    cfg = config.normalize(cfg);
    return cfg;
}

/**
 * Gets a config object out of a dom element.
 *
 * @method get
 * @param {HTMLElement} el
 * @return {Object} the configuration object.
 * @private
 * @static
 */
config.get = function (el) {
    var cfg = {};
    if (el.dataset.url) {
        cfg.url = el.dataset.url;
    }
    if (el.dataset.title) {
        cfg.title = el.dataset.title;
    }
    return cfg;
};

/**
 * Makes sure that the configuration object is valid.
 *
 * @method validate
 * @param {Object} cfg key/value pairs object.
 * @return {Object} the configuration object.
 * @private
 * @static
 */
config.validate = function (cfg) {
    if (!isObject(cfg)) {
        throw new Error('cfg is not an object');
    }
    if (cfg.hasOwnProperty('title') && !isString(cfg.title)) {
        throw new Error('cfg.title looks dodgy');
    }
    if (cfg.hasOwnProperty('content') && !isString(cfg.content)) {
        throw new Error('cfg.content looks dodgy');
    }
    if (cfg.hasOwnProperty('url') && (!isString(cfg.url) || !cfg.url.trim())) {
        throw new Error('cfg.url looks dodgy');
    }
    if (cfg.hasOwnProperty('panel') && !isNumber(cfg.panel) && !isElement(cfg.panel) && !isString(cfg.panel)) {
        throw new Error('cfg.panel looks dodgy');
    }
    if (cfg.hasOwnProperty('error') && !isBoolean(cfg.error)) {
        throw new Error('cfg.error looks dodgy');
    }
    return cfg;
};

/**
 * Adds in default properties if they were not given.
 *
 * @method defaults
 * @param {Object} cfg key/value pairs object.
 * @return {Object} the configuration object.
 * @private
 * @static
 */
config.defaults = function (cfg) {
    if (!cfg.hasOwnProperty('title')) {
        cfg.title = '';
    }
    if (!cfg.hasOwnProperty('content')) {
        cfg.content = '';
    }
    if (!cfg.hasOwnProperty('error')) {
        cfg.error = false;
    }
    return cfg;
};

/**
 * Makes sure that values are what they are expected to be.
 *
 * @method normalize
 * @param {Object} cfg key/value pairs object.
 * @return {Object} the configuration object.
 * @private
 * @static
 */
config.normalize = function (cfg) {
    if (cfg.hasOwnProperty('panel') && !isElement(cfg.panel)) {
        cfg.panel = spin.getPanel(cfg.panel);
    }
    return cfg;
};

/**
 * Counter used to generate ids.
 * @private
 * @type {Number}
 */
var spinId = 0;

/**
 * Generates a panel.
 *
 * @class panel
 * @constructor
 * @param {Object} cfg Panel configuration object.
 * @return {HTMLElement} The panel that has been created.
 * @private
 */
function panel(cfg) {
    var div, pnl;
    spinId++;
    div = document.createElement('div');
    div.innerHTML =
        '<li id="spin-id'+spinId+'" class="spin-panel spin-hiddenright">' +
            '<div class="spin-panel-hd"></div>' +
            '<div class="spin-panel-bd"></div>' +
        '</li>';
    pnl = div.firstChild;
    panel.setTitle(pnl, cfg.title);
    panel.setContent(pnl, cfg.content);
    panel.setError(pnl, cfg.error);
    return pnl;
}

/**
 * Updates panel title.
 *
 * @method setTitle
 * @param {HTMLElement} pnl corresponding dom element
 * @param {String} title panel title
 * @private
 * @static
 */
panel.setTitle = function (pnl, title) {
    var oldtitle, newtitle;
    oldtitle = pnl.querySelector('.spin-panel-hd');
    newtitle = document.createElement('div');
    newtitle.className = 'spin-panel-hd';
    newtitle.innerHTML = '<span class="spin-title">' + title + '</span>';
    pnl.replaceChild(newtitle, oldtitle);
};

/**
 * Updates panel content.
 *
 * @method setContent
 * @param {HTMLElement} pnl corresponding dom element.
 * @param {String} content
 * @private
 * @static
 */
panel.setContent = function (pnl, content) {

    var oldcontent,
        newcontent;

    oldcontent = pnl.querySelector('.spin-panel-bd');

    newcontent = document.createElement('div');
    newcontent.className = 'spin-panel-bd';
    newcontent.innerHTML = content;

    // We need to do some hackery with script tags.
    // Even though it is now a node, the code won't be executed
    // because it was initially created through innerHTML.
    [].forEach.call(newcontent.querySelectorAll('script'), function (script) {
        var newscript = document.createElement('script');
        [].forEach.call(script.attributes, function (attr) {
            newscript.setAttribute(attr.nodeName, attr.nodeValue);
        });
        // this way the code will be executed.
        newscript.appendChild(document.createTextNode(script.textContent));
        script.parentNode.replaceChild(newscript, script);
    });

    pnl.replaceChild(newcontent, oldcontent);
};

/**
 * Sets or unsets a panel loading state.
 *
 * @method setLoading
 * @param {HTMLElement} pnl corresponding dom element.
 * @param {Boolean} loading
 * @private
 * @static
 */
panel.setLoading = function (pnl, loading) {
    if (loading) {
        pnl.classList.add('loading');
    } else {
        pnl.classList.remove('loading');
    }
};

/**
 * Sets or unsets a panel error state.
 *
 * @method setError
 * @param {HTMLElement} pnl corresponding dom element.
 * @param {Boolean} err
 * @private
 * @static
 */
panel.setError = function (pnl, err) {
    if (err) {
        pnl.classList.add('error');
    } else {
        pnl.classList.remove('error');
    }
};

/**
 * Appens a panel into the dom.
 *
 * @method append
 * @param {HTMLElement} pnl corresponding dom element
 * @private
 * @static
 */
panel.append = function (pnl) {
    document.querySelector('#spin-panels').appendChild(pnl);
};

/**
 * Deletes all panels after given panel.
 *
 * @method deleteAfter
 * @param {HTMLElement} pnl corresponding dom element
 * @return {HTMLElement}
 * @private
 * @static
 */
panel.deleteAfter = function (pnl) {
    var panels = document.querySelector('#spin-panels');
    while ( panels.lastChild !== pnl ) {
        panels.removeChild(panels.lastChild);
    }
    return pnl;
};

/**
 * True if given panel is currently visible.
 *
 * @method isVisible
 * @param {HTMLElement} pnl.
 * @return {Boolean}
 * @private
 * @static
 */
panel.isVisible = function (pnl) {
    var vis = panel.getVisibility(pnl);
    return vis === spin.PANEL_FULL ||
           vis === spin.PANEL_SMALL ||
           vis === spin.PANEL_BIG;
};

/**
 * Returns the current visibility state of given panel.
 *
 * @method getVisibility
 * @param {HTMLElement} pnl
 * @return {String}
 * @private
 * @static
 */
panel.getVisibility = function (pnl) {
    var state;
    // we're not interested in css classes that don't relate to panel visibility
    state = [].filter.call(pnl.classList, function (cls) {
        return cls === 'spin-' + spin.PANEL_FULL ||
               cls === 'spin-' + spin.PANEL_BIG ||
               cls === 'spin-' + spin.PANEL_SMALL ||
               cls === 'spin-' + spin.PANEL_HIDDENRIGHT ||
               cls === 'spin-' + spin.PANEL_HIDDENLEFT;
    });
    // a panel must have one and only one visibility state
    if (state.length!==1) {
        throw new Error('panel visibility state looks dodgy');
    }
    // removes the 'spin-' prefix
    return state[0].substr(5);
};

/**
 * Updates the visibility of given panel.
 * Doing so could trigger a panel animation.
 *
 * @method setVisibility
 * @param {HTMLElement} pnl
 * @param {String} vis the new visibility state
 * @private
 * @static
 */
panel.setVisibility = function (pnl, vis) {
    var cur = panel.getVisibility(pnl);
    // small helper to work out if given visibility is hidden
    function hiddenState(vis) {
        return vis === spin.PANEL_HIDDENLEFT ||
               vis === spin.PANEL_HIDDENRIGHT;
    }
    // updates css class if currently hidden and stays hidden
    // simply swap sides (spin-hiddenright <-> spin-hiddenleft)
    if (hiddenState(cur) && hiddenState(vis)) {
        pnl.classList.remove('spin-' + cur);
        pnl.classList.add('spin-' + vis);
    // otherwise works out the appropriate animation class
    // e.g. if currently full and set to small
    // corresponding anim class should be 'spin-full-small'
    } else {
        pnl.addEventListener('animationend', panel.onAnimEnd, false);
        pnl.classList.add('spin-' + cur + '-' + vis);
    }
};

/**
 * Executes when panel animation has finished.
 *
 * @method onAnimEnd
 * @this {HTMLElement} panel
 * @private
 * @static
 */
panel.onAnimEnd = function (e) {
    var animCls = e.animationName;                 // e.g. spin-full-small
    var oldCls  = 'spin-' + animCls.split('-')[1]; // e.g. spin-full
    var newCls  = 'spin-' + animCls.split('-')[2]; // e.g. spin-small
    this.classList.remove(animCls);
    this.classList.remove(oldCls);
    this.classList.add(newCls);
    breadcrumb.syncAll();
    this.removeEventListener('animationend', panel.onAnimEnd);
};

/**
 * True if given panel is the home panel (i.e. the first panel).
 *
 * @method isHome
 * @param {HTMLElement} pnl
 * @return {Boolean}
 * @private
 * @static
 */
panel.isHome = function (pnl) {
    return pnl.previousSibling === null;
};

/**
 * True if given panel is the last one.
 *
 * @method isLast
 * @param {HTMLElement} pnl
 * @return {Boolean}
 * @private
 * @static
 */
panel.isLast = function (pnl) {
    return pnl.nextSibling === null;
};

/**
 * Returns the panel following given panel.
 *
 * @method getNext
 * @param {HTMLElement} pnl
 * @returns {HTMLElement}
 * @private
 * @static
 */
panel.getNext = function (pnl) {
    return pnl.nextSibling;
};

/**
 * Returns the panel preceding given panel.
 *
 * @method getPrevious
 * @param {HTMLElement} pnl
 * @return {HTMLElement}
 * @private
 * @static
 */
panel.getPrevious = function (pnl) {
    return pnl.previousSibling;
};
 /**
  * Generates a bread crumb.
  *
  * @class breadcrumb
  * @constructor
  * @param {String} id    panel id
  * @param {String} title panel title
  * @return {HTMLElement}
  * @private
  * @static
  */
function breadcrumb(id, title) {
    var el = document.createElement('li');
    el.id = id + '-crumb';
    el.className = 'crumb4';
    el.appendChild(document.createTextNode(title));
    return el;
}

/**
 * Returns bread crumb of given panel.
 *
 * @method get
 * @param {HTMLElement} pnl panel dom element.
 * @return {HTMLElement}
 * @private
 * @static
 */
breadcrumb.get = function (pnl) {
    return document.querySelector('#' + pnl.id + '-crumb');
};

/**
 * Updates bread crumb title.
 *
 * @method setTitle
 * @param {HTMLElement} brd bread crumb dom element.
 * @param {String} title
 * @private
 * @static
 */
breadcrumb.setTitle = function (brd, title) {
    var oldtitle, newtitle;
    oldtitle = brd.lastChild;
    newtitle = document.createTextNode(title);
    brd.replaceChild(newtitle, oldtitle);
};

/**
 * Appends a bread crumb to the dom.
 *
 * @method append
 * @param {HTMLElement} brd bread crumb dom element.
 * @private
 * @static
 */
breadcrumb.append = function (brd) {
    document.querySelector('#spin-nav').appendChild(brd);
};

/**
 * Returns the corresponding panel id.
 * A breadcrumb id contains a reference to the panel it is linked to.
 *
 * @method getPanelId
 * @param {HTMLElement} brd
 * @return {String}
 * @private
 * @static
 */
breadcrumb.getPanelId = function (brd) {
    // "spin-id99-crumb" ~> "spin-id99"
    return brd.id.substr(0, brd.id.lastIndexOf('-'));
};

/**
 * Returns the css class corresponding to the visibility of given panel.
 *
 * @method getClassFromPanel
 * @param {HTMLElement} pnl
 * @return {String}
 * @private
 * @static
 */
breadcrumb.getClassFromPanel = function (pnl) {
    if (panel.isLast(pnl)) {
        return panel.isVisible(pnl) ? 'crumb4' : 'crumb1';
    } else if (panel.isVisible(pnl)) {
        return panel.isVisible(pnl.nextSibling) ? 'crumb5' : 'crumb6';
    } else {
        return panel.isVisible(pnl.nextSibling) ? 'crumb3' : 'crumb2';
    }
};

/**
 * Synchronizes all bread crumbs with the current state of the view.
 *
 * @method syncAll
 * @private
 * @static
 */
breadcrumb.syncAll = function () {

    var panels = document.querySelector('#spin-panels'),
        curNav = document.querySelector('#spin-nav'),
        newNav,
        frag;

    frag = document.createDocumentFragment();

    // We loop through all panels and make sure that the state
    // of the panel is reflected on its corresponding bread crumb
    // in the navigation.
    [].forEach.call(panels.childNodes, function (pnl) {
        var brd = breadcrumb.get(pnl).cloneNode(true);
        brd.className = breadcrumb.getClassFromPanel(pnl);
        frag.appendChild(brd);
    });

    newNav = document.createElement('ol');
    newNav.id = 'spin-nav';
    newNav.appendChild(frag);

    document.querySelector('#spin').replaceChild(newNav, curNav);
};
/**
 * Drops Spin markup on the page.
 * @private
 */
function dropBaseMarkup() {
    var outer = document.createElement('div');
    outer.innerHTML =
        '<div id="spin">' +
            '<ol id="spin-nav"></ol>' +
            '<ol id="spin-panels"></ol>' +
        '</div>';
    document.body.appendChild(outer.firstChild);
}

/**
 * Handler for click events occuring inside Spin.
 * @private
 */
function registerClickHandler() {
    document.querySelector('#spin').addEventListener('click', function (ev) {
        var id,
            nav, // nav element that contains the event target
            pnl, // panel that contains the nav element
            cfg; // new panel configuration

        if (isBreadCrumb(ev.target)) {
            id  = breadcrumb.getPanelId(ev.target);
            pnl = document.getElementById(id);
            spin.moveTo(pnl);
            return;
        }

        // The click might not have been made on the nav element itself
        // but on a child element instead. So we need to work out whether
        // the click target is contained within a nav element.
        nav = getNav(ev.target);

        if (!nav) {
            return;
        }

        pnl = spin.getPanel(nav);

        if (!nav.classList.contains('loaded')) {
            cfg = config.get(nav);
            // reset previously loaded nav item in the current panel (if any)
            if (pnl.querySelector('.nav.loaded')) {
                pnl.querySelector('.nav.loaded').classList.remove('loaded');
            }
            // we reuse the panel following the one from where the click originated
            if (panel.getNext(pnl)) {
                cfg.panel = panel.getNext(pnl).id;
            }
            spin(cfg);
            nav.classList.add('loaded');
        // If nav is already loaded it means that the corresponding panel
        // has been loaded too. So we simply need to move there.
        } else {
            spin.moveTo(panel.getNext(pnl));
        }
    }, false);
}

/**
 * Appends a new panel and returns it.
 *
 * @example
 *      // Adds an empty panel (no content, no title)
 *      spin();
 *
 * @example
 *      // Adds a panel with content and title
 *      spin({ content: '<p>Hello World!</p>', title: 'Hi' });
 *
 * @example
 *      // Adds a panel with content only
 *      spin({ content: '<p>Hello Again!</p>' });
 *
 * @class spin
 * @constructor
 * @throws
 * @param {Object}                    [cfg]         Panel configuration object. Defaults to {title:'',content:''}.
 * @param {String}                    [cfg.title]   Title of the panel (and its bread crumb). Defaults to an empty string.
 * @param {String}                    [cfg.content] Content of the panel. Defaults to an empty string.
 * @param {String}                    [cfg.url]     If given will fetch content from that url
 * @param {String|Number|HTMLElement} [cfg.panel]   If given will use that panel instead of creating a new one.
 * @param {Boolean}                   [cfg.error]   If given will create an error panel
 * @returns {HTMLElement}
 */
window.spin = function (cfg) {

    var pnl, // panel
        brd; // bread crumb

    if (spin.xhr instanceof XMLHttpRequest) {
        spin.xhr.abort();
        delete spin.xhr;
    }

    cfg = config(cfg);

    if (cfg.panel) {
        pnl = cfg.panel;
        brd = breadcrumb.get(pnl);
        panel.deleteAfter(pnl);
        breadcrumb.setTitle(brd, cfg.title);
        panel.setTitle(pnl, cfg.title);
        panel.setContent(pnl, cfg.content);
        panel.setError(pnl, cfg.error);
    } else {
        pnl = panel(cfg);
        brd = breadcrumb(pnl.id, cfg.title);
        breadcrumb.append(brd);
        panel.append(pnl);
    }

    breadcrumb.syncAll();

    if (cfg.url) {

        panel.setLoading(pnl, true);

        spin.xhr = new XMLHttpRequest();

        spin.xhr.addEventListener('loadend', function (e) {
            if (this.status >= 400) { /* i.e. if error */
                spin({
                    error: true,
                    title: this.status + ' ' + this.statusText,
                    content: '<p>Could not load ' + cfg.url +'</p>',
                    panel: pnl.id
                });
            } else {
                panel.setContent(pnl, this.responseText);
            }
            // whatever happened panel is not loading any more
            panel.setLoading(pnl, false);
        }, false);

        spin.xhr.open('GET', cfg.url);
        spin.xhr.send();
    }

    spin.moveTo(pnl);

    return pnl;
};

// Panel states
spin.PANEL_HIDDENRIGHT = 'hiddenright';
spin.PANEL_HIDDENLEFT  = 'hiddenleft';
spin.PANEL_FULL        = 'full';
spin.PANEL_BIG         = 'big';
spin.PANEL_SMALL       = 'small';

/**
 * Returns corresponding panel.
 *
 * The parameter can be of three different types:
 *
 * -    Number: the method returns the panel at given position (zero based index).
 *
 *          // Returns the third panel (zero based index)
 *          spin.getPanel(2);
 *
 * -    String: the method assumes a css selector and returns the first panel matching it
 *      or containing a matching element.
 *
 *          // Returns the first panel containing an element that matches given css selector.
 *          spin.getPanel('#html_id');
 *
 * -    HTMLElement: the method returns the panel that contains given element.
 *
 *          // Previous example could be rewritten like this
 *          spin.getPanel(document.querySelector('#html_id'));
 *
 * @method getPanel
 * @param {Number|HTMLElement|String} elt.
 * @returns {HTMLElement}
 * @throws {Error} 'bad function call'
 * @throws {Error} 'panel not found'
 * @static
 */
spin.getPanel = function (elt) {
    if (!isNumber(elt) && !isElement(elt) && !isString(elt)) {
        throw new Error('bad function call');
    }
    if (isNumber(elt)) {
        elt = document.querySelector('#spin-panels').childNodes[elt];
    } else if (isString(elt)) {
        elt = document.querySelector(elt);
    }
    while (isElement(elt)) {
        if (isPanel(elt)) {
            return elt;
        }
        elt = elt.parentNode;
    }
    throw new Error('panel not found');
};

/**
 * Moves to corresponding panel.
 *
 * @method moveTo
 * @param {Number|String|HTMLElement} elt
 * @returns {HTMLElement}
 * @throws 'panel not found'
 * @static
 */
spin.moveTo = function (elt) {
    var dest,
        destState,
        pnl,
        pnlState,
        state,
        states,
        nextState;

    dest      = spin.getPanel(elt);        // panel of destination
    destState = panel.getVisibility(dest); // current state of destination panel

    // Don't move if destination panel is already visible and either big or full
    if (destState == spin.PANEL_BIG || destState == spin.PANEL_FULL) {
        return dest;
    }

    pnl = dest;

    // Moving forward, left animation
    if (destState == spin.PANEL_HIDDENRIGHT) {
        // If home panel is the destination, it takes all the space.
        // The only case where home panel is on the right is when it loads for the first time.
        if (panel.isHome(pnl)) {
            states = [ spin.PANEL_FULL ];
        // The next state of the destination panel is big and the one on its left small.
        } else {
            states = [ spin.PANEL_BIG, spin.PANEL_SMALL ];
        }
        // Animates all panels between the destination panel
        // and the currently first visible panel.
        do {
            nextState = states.shift() || spin.PANEL_HIDDENLEFT;
            panel.setVisibility(pnl, nextState);
            pnl = panel.getPrevious(pnl);
        } while (pnl && panel.getVisibility(pnl) != spin.PANEL_HIDDENLEFT);
    // Moving backward, right animation
    } else {
        // If home panel is the destination, it takes all the space
        if (panel.isHome(pnl)) {
            states = [ spin.PANEL_FULL ];
        // The next state of the destination panel is big
        // and the one on its left small.
        } else {
            states = [ spin.PANEL_SMALL, spin.PANEL_BIG ];
            // When moving backward we need to start looping from the panel
            // sitting right before to the destination panel.
            pnl  = panel.getPrevious(pnl);
        }
        // Animates all panels between the panel sitting right before the
        // destination panel and the currently last visible panel.
        do {
            nextState = states.shift() || spin.PANEL_HIDDENRIGHT;
            panel.setVisibility(pnl, nextState);
            pnl = panel.getNext(pnl);
        } while (pnl && panel.getVisibility(pnl) != spin.PANEL_HIDDENRIGHT);
    }

    return dest;
};

dropBaseMarkup();
registerClickHandler();
spin(config(document.body));


})(window, document);