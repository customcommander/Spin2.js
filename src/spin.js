/**
 * Spin.js - User Interface For Web Applications
 * @fileoverview This is the source code for Spin.js
 * @author Julien Gonzalez
 */
(function (window, document) {

    var toString = Object.prototype.toString,
        spinId = 0;

    /**
     * Reference to #spin node
     * @private
     * @see dropBaseMarkup
     * @type {HTMLElement}
     */
    var elSpin;

    /**
     * Reference to #spin-panels node
     * @private
     * @see dropBaseMarkup
     * @type {HTMLElement}
     */
    var elPanels;

    // Returns true if o is undefined
    function isUndefined(o) {
        return toString.call(o) == '[object Undefined]';
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
        return !!o && o.parentNode === elPanels;
    }

    // Looks for the nav element that contains el and returns it.
    // Returns null if not found.
    function getNav(el) {
        if (!isElement(el)) {
            return null;
        }
        do {
            if (el.classList.contains('nav')) {
                return el;
            }
            el = el.parentNode;
        } while (el);
        return null;
    }

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
        // Keeping references to these important elements.
        elSpin   = document.body.appendChild(outer.firstChild);
        elPanels = elSpin.lastChild;
    }

    /**
     * Handler for click events occuring inside Spin.
     * @private
     */
    function registerClickHandler() {

        elPanels.addEventListener('click', function (ev) {

            var nav = getNav(ev.target),
                panel,
                cfg;

            if (!nav) {
                return;
            }

            panel = spin.getPanel(nav);

            if (!nav.classList.contains('loaded')) {
                cfg = config.get(nav);
                // reset previously loaded nav item in the current panel (if any)
                if (panel.querySelector('.nav.loaded')) {
                    panel.querySelector('.nav.loaded').classList.remove('loaded');
                }
                if (panel.nextSibling) {
                    cfg.panel = panel.nextSibling.id;
                }
                spin(cfg);
                nav.classList.add('loaded');
            } else {
                spin.moveTo(panel.nextSibling);
            }
        }, false);
    }

    /**
     * Register handler for clicks on bread crumbs.
     * @private
     * @todo merge with other click handler
     */
    function registerNavClickHandler() {

        var el = document.getElementById('spin');

        el.addEventListener('click', function (ev) {

            var id, panel;

            function isBreadCrumb(el) {
                //@todo look for "crumb" in css class also?
                return el.parentNode.id === 'spin-nav';
            }

            if (isBreadCrumb(ev.target)) {
                // extracting the panel id from the bread crumb id:
                // "spin-id99-crumb" ~> "spin-id99"
                id = ev.target.id;
                id = id.substr(0, id.lastIndexOf('-'));
                panel = document.getElementById(id);
                spin.moveTo(panel);
            }
        }, false);
    }

    /**
     * Handler for animation end events occuring inside Spin.
     * @private
     */
    function registerAnimationEndHandler() {
        elPanels.addEventListener('animationend', function (e) {
            var panel   = e.target,
                animCls = e.animationName,
                oldCls  = 'spin-' + animCls.split('-')[1],
                newCls  = 'spin-' + animCls.split('-')[2];
            panel.classList.remove(animCls);
            panel.classList.remove(oldCls);
            panel.classList.add(newCls);
            breadcrumb.syncAll();
        });
    }

    /**
     * Generates, validates and normalizes the panel configuration object
     * @private
     * @param {Object|HTMLElement} [o]
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
     * @private
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
     * @private
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
        return cfg;
    };

    /**
     * @private
     */
    config.defaults = function (cfg) {
        if (!cfg.hasOwnProperty('title')) {
            cfg.title = '';
        }
        if (!cfg.hasOwnProperty('content')) {
            cfg.content = '';
        }
        return cfg;
    };

    /**
     * @private
     */
    config.normalize = function (cfg) {
        if (cfg.hasOwnProperty('panel') && !isElement(cfg.panel)) {
            cfg.panel = spin.getPanel(cfg.panel);
        }
        return cfg;
    };

    /**
     * Generates a panel
     * @private
     * @param {Object} cfg Panel configuration object
     * @returns {HTMLElement} The panel that has been created
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
        return pnl;
    }

    /**
     * Updates panel title
     * @private
     * @param {HTMLElement} pnl corresponding dom element
     * @param {String} title panel title
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
     * Updates panel content
     * @private
     * @param {HTMLElement} pnl corresponding dom element
     * @param {String} content
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
     * Sets or unsets a panel loading state
     * @private
     * @param {HTMLElement} pnl corresponding dom element
     * @param {Boolean} loading
     */
    panel.setLoading = function (pnl, loading) {
        if (loading) {
            pnl.classList.add('loading');
        } else {
            pnl.classList.remove('loading');
        }
    };

    /**
     * Appens a panel into the dom
     * @private
     * @param {HTMLElement} pnl corresponding dom element
     */
    panel.append = function (pnl) {
        document.querySelector('#spin-panels').appendChild(pnl);
    };

    /**
     * Deletes all panels after given panel.
     * @private
     * @param {HTMLElement} pnl corresponding dom element
     * @returns {HTMLElement}
     */
    panel.deleteAfter = function (pnl) {
        while ( elPanels.lastChild != pnl ) {
            elPanels.removeChild(elPanels.lastChild);
        }
        return pnl;
    };

     /**
      * Generates a bread crumb
      * @private
      * @param {String} id    panel id
      * @param {String} title panel title
      * @returns {HTMLElement}
      */
    function breadcrumb(id, title) {
        var el = document.createElement('li');
        el.id = id + '-crumb';
        el.className = 'crumb4';
        el.appendChild(document.createTextNode(title));
        return el;
    }

    /**
     * Returns bread crumb of given panel
     * @private
     * @param {HTMLElement} pnl panel dom element
     * @returns {HTMLElement}
     */
    breadcrumb.get = function (pnl) {
        return document.querySelector('#' + pnl.id + '-crumb');
    };

    /**
     * Updates bread crumb title
     * @private
     * @param {HTMLElement} brd bread crumb dom element
     * @param {String} title
     */
    breadcrumb.setTitle = function (brd, title) {
        var oldtitle, newtitle;
        oldtitle = brd.lastChild;
        newtitle = document.createTextNode(title);
        brd.replaceChild(newtitle, oldtitle);
    };

    /**
     * Appends a bread crumb to the dom
     * @private
     * @param {HTMLElement} brd bread crumb dom element
     */
    breadcrumb.append = function (brd) {
        document.querySelector('#spin-nav').appendChild(brd);
    };

    /**
     * Synchronizes all bread crumbs with the current state of the view
     * @private
     */
    breadcrumb.syncAll = function () {

        var curNav = document.querySelector('#spin-nav'),
            newNav,
            frag;

        // Helper - Returns true if panel is the last one
        function isLast(panel) {
            return !panel.nextSibling;
        }

        // Helper - Returns true if panel is visible
        function isVisible(panel) {
            var cl = panel.classList;
            return cl.contains('spin-' + spin.PANEL_FULL) ||
                cl.contains('spin-' + spin.PANEL_SMALL) ||
                cl.contains('spin-' + spin.PANEL_BIG);
        }

        // Helper - Returns the css class for the bread crumb
        // according to its corresponding panel
        function getClassName(panel) {
            if (isLast(panel)) {
                return isVisible(panel) ? 'crumb4' : 'crumb1';
            } else if (isVisible(panel)) {
                return isVisible(panel.nextSibling) ? 'crumb5' : 'crumb6';
            } else {
                return isVisible(panel.nextSibling) ? 'crumb3' : 'crumb2';
            }
        }

        frag = document.createDocumentFragment();

        // We loop through all panels and make sure that the state
        // of the panel is reflected on its corresponding bread crumb
        // in the navigation.
        [].forEach.call(elPanels.childNodes, function (panel) {
            var brd = breadcrumb.get(panel).cloneNode(true);
            brd.className = getClassName(panel);
            frag.appendChild(brd);
        });

        newNav = document.createElement('ol');
        newNav.id = 'spin-nav';
        newNav.appendChild(frag);

        elSpin.replaceChild(newNav, curNav);
    };

    /**
     * Appends a new panel and returns it.
     *
     * @example
     * // Adds an empty panel (no content, no title)
     * spin();
     *
     * @example
     * // Adds a panel with content and title
     * spin({ content: '<p>Hello World!</p>', title: 'Hi' });
     *
     * @example
     * // Adds a panel with content only
     * spin({ content: '<p>Hello Again!</p>' });
     *
     * @name window.spin
     * @function
     * @throws
     * @param {Object}                    [cfg]         - Panel configuration object. Defaults to {title:'',content:''}.
     * @param {String}                    [cfg.title]   - Title of the panel (and its bread crumb). Defaults to an empty string.
     * @param {String}                    [cfg.content] - Content of the panel. Defaults to an empty string.
     * @param {String}                    [cfg.url]     - If given will fetch content from that url
     * @param {String|Number|HTMLElement} [cfg.panel]   - If given will use that panel instead of creating a new one.

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

            spin.xhr.addEventListener('load', function () {
                panel.setContent(pnl, this.responseText);
                panel.setLoading(pnl, false);
            }, false);

            spin.xhr.addEventListener('abort', function () {
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
     * @example
     * // Returns the third panel (zero based index)
     * spin.getPanel(2);
     *
     * @example
     * // Returns the panel that contains that element
     * spin.getPanel('elementID');
     *
     * @example
     * // Previous example could be rewritten like this
     * spin.getPanel(document.getElementById('elementID'));
     *
     * @name spin.getPanel
     * @function
     * @param {HTMLElement|String|Number} elt
     * @returns {HTMLElement}
     * @throws {Error} 'bad function call'
     * @throws {Error} 'panel not found'
     */
    spin.getPanel = function (elt) {
        if (
            !arguments.length || (
                !isElement(elt) &&
                (!isString(elt) || !elt.trim()) &&
                (!isNumber(elt) || !isFinite(elt)))
            ) {
            throw new Error('bad function call');
        }

        if (isNumber(elt)) {
            elt = elPanels.childNodes[elt];
        }
        else if (isString(elt)) {
            elt = document.getElementById(elt);
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
     * Returns the current state of corresponding panel.
     *
     * @private
     * @param {Number|String|HTMLElement} elt
     * @returns {String} Current state of corresponding panel
     * @throws {Error} If panel has no state.
     * @see spin#PANEL_SMALL
     * @see spin#PANEL_BIG
     * @see spin#PANEL_FULL
     * @see spin#PANEL_HIDDENRIGHT
     * @see spin#PANEL_HIDDENLEFT
     */
    function getPanelState(elt) {
        var panel = spin.getPanel(elt);
        var cls = panel.classList;
        if (cls.contains('spin-' + spin.PANEL_FULL)) return spin.PANEL_FULL;
        if (cls.contains('spin-' + spin.PANEL_BIG)) return spin.PANEL_BIG;
        if (cls.contains('spin-' + spin.PANEL_SMALL)) return spin.PANEL_SMALL;
        if (cls.contains('spin-' + spin.PANEL_HIDDENRIGHT)) return spin.PANEL_HIDDENRIGHT;
        if (cls.contains('spin-' + spin.PANEL_HIDDENLEFT)) return spin.PANEL_HIDDENLEFT;
        throw new Error('panel has no state');
    }

    /**
     * Moves to corresponding panel.
     *
     * @name spin.moveTo
     * @function
     * @param {Number|String|HTMLElement} elt
     * @returns {HTMLElement}
     * @throws 'panel not found'
     */
    spin.moveTo = function (elt) {
        var dest,
            destState,
            panel,
            panelState,
            state,
            states,
            nextState;

        // Simple helper that works out whether state is hidden.
        function isHiddenState(state) {
            return state == spin.PANEL_HIDDENLEFT || state == spin.PANEL_HIDDENRIGHT;
        }

        // Works out and adds the required css classes in order to animate the panels.
        // If a panel is currently hidden on one side and is going to stay hidden on the
        // other side, then we do not animate it but rather switch sides instead.
        function animate(panel, nextState) {
            var curState = getPanelState(panel);

            if (isHiddenState(curState) && isHiddenState(nextState)) {
                // This wont animate but just swap sides instead.
                // e.g. replaces 'spin-hiddenright' with 'spin-hiddenleft'
                panel.classList.remove('spin-' + curState);
                panel.classList.add('spin-' + nextState);
            }
            else {
                // Works out the animation we need.
                // If a panel is currently minimized (small) and has to
                // disappear to the left (hiddenleft),
                // we need this css animation: 'spin-small-hiddenleft'
                panel.classList.add('spin-' + curState + '-' + nextState);
            }
        }

        dest      = spin.getPanel(elt);          // panel of destination
        destState = getPanelState(dest);    // current state of destination panel

        // Don't move if destination panel is already visible and either big or full
        if (destState == spin.PANEL_BIG || destState == spin.PANEL_FULL) {
            return dest;
        }

        panel = dest;

        // Moving forward, left animation
        if (destState == spin.PANEL_HIDDENRIGHT) {
            if (!panel.previousSibling) { /* i.e. home panel */
                // If home panel is the destination, it takes all the space.
                // The only case where home panel is on the right is when
                // it loads for the first time.
                states = ['full'];
            }
            else {
                // The next state of the destination panel is big
                // and the one on its left small.
                states = ['big', 'small'];
            }

            // Animates all panels between the destination panel
            // and the currently first visible panel.
            do {
                nextState = states.shift() || 'hiddenleft';
                animate(panel, nextState);
                panel = panel.previousSibling;
            } while (panel && getPanelState(panel) != spin.PANEL_HIDDENLEFT);
        }
        // Moving backward, right animation
        else {
            if (!panel.previousSibling) { /* i.e. home panel */
                // If home panel is the destination, it takes all the space
                states = ['full'];
            }
            else {
                // The next state of the destination panel is big
                // and the one on its left small.
                states = ['small', 'big'];

                // When moving backward we need to start looping from the panel
                // sitting right before to the destination panel.
                panel  = panel.previousSibling;
            }

            // Animates all panels between the panel sitting right before the
            // destination panel and the currently last visible panel.
            do {
                nextState = states.shift() || 'hiddenright';
                animate(panel, nextState);
                panel = panel.nextSibling;
            } while (panel && getPanelState(panel) != spin.PANEL_HIDDENRIGHT);
        }

        return dest;
    };

    window.addEventListener('load', function () {
        dropBaseMarkup();
        registerClickHandler();
        registerNavClickHandler();
        registerAnimationEndHandler();
        spin(config(document.body));
    }, false);

})(window, document);