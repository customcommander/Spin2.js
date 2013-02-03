/**
 * Spin.js - User Interface For Web Applications
 * @fileoverview This is the source code for Spin.js
 * @author Julien Gonzalez
 */
(function (win, doc) {

    var toString = Object.prototype.toString,
        spinId = 0,
        spin,       //Internal copy of window.spin
        getPanel,
        getPanelState,
        moveTo,
        deleteAfter,
        loader;     //Internal copy of the current loader

    var isNumber,
        isFunction,
        isObject,
        isString,
        isElement,
        isPanel;

    /**
     * Reference to #spin node
     * @private
     * @see dropBaseMarkup
     * @type {HTMLElement}
     */
    var elSpin;

    /**
     * Reference to #spin-nav node
     * @private
     * @see dropBaseMarkup
     * @type {HTMLElement}
     */
    var elNav;

    /**
     * Reference to #spin-panels node
     * @private
     * @see dropBaseMarkup
     * @type {HTMLElement}
     */
    var elPanels;

    if (win.spin) {
        throw new Error('spin already exists');
    }

    /**
     * Drops Spin markup on the page.
     *
     *  <div id="spin">
     *      <ol id="spin-nav"></ol>
     *      <ol id="spin-panels"></ol>
     *  </div>
     *
     * @private
     */
    function dropBaseMarkup() {
        elSpin = doc.createElement('div');
        elSpin.id = 'spin';
        elNav = doc.createElement('ol');
        elNav.id = 'spin-nav';
        elPanels = doc.createElement('ol');
        elPanels.id = 'spin-panels';
        elSpin.appendChild(elNav);
        elSpin.appendChild(elPanels);
        doc.body.appendChild(elSpin); 
    }

    /**
     * Handler for click events occuring inside Spin.
     * @private
     */
    function registerClickHandler() {
        elPanels.addEventListener('click', function (ev) {
            var t = ev.target;
            if (!t.classList.contains('nav')) {
                return;
            }
            if (!t.classList.contains('loaded')) {
                loader(t);
                t.classList.add('loaded');
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
        });
    }

    /**
     * Replaces the title of the panel.
     * @private
     * @param {String} title the new title
     */
    function setTitle(panel, title) {

        var oldtitle, newtitle;

        oldtitle = panel.querySelector('.spin-panel-hd');

        newtitle = document.createElement('div');
        newtitle.className = 'spin-panel-hd';
        newtitle.innerHTML = '<span class="spin-title">' + title + '</span>';

        panel.replaceChild(newtitle, oldtitle);
    }

    /**
     * Replaces the content of the panel.
     * @private
     * @param {String} content the new html content
     */
    function setContent(panel, content) {

        var oldcontent,
            newcontent,
            cont,
            i,
            n,
            list,
            child;

        oldcontent = panel.querySelector('.spin-panel-bd');

        newcontent = document.createElement('div');
        newcontent.className = 'spin-panel-bd';

        // In order to transform our html content string into proper dom nodes
        cont = document.createElement('div');
        cont.innerHTML = content;

        list = cont.childNodes;

        for (i=0, n=list.length; i<n; i++) {
            child = list[i].cloneNode(true);
            // We need to do some hackery with script tags.
            // Even though it is now a node, the code won't be executed
            // because it was initially created through innerHTML.
            if (child.nodeName.toLowerCase() == 'script') {
                child = document.createElement('script');
                if (list[i].type) {
                    child.type = list[i].type;
                }
                // Reinjects code properly this time.
                child.appendChild(document.createTextNode(list[i].textContent));
            }
            newcontent.appendChild(child);
        }

        panel.replaceChild(newcontent, oldcontent);
    }

    /**
     * Creates and appends a panel into the DOM
     * @private
     * @param {Object} cfg Panel configuration
     * @returns {HTMLElement} The panel that has been created
     */
    function appendPanel(cfg) {
        var div, panel;

        spinId++;

        div = document.createElement('div');

        div.innerHTML = [
            '<li id="spin-id'+spinId+'" class="spin-panel spin-hiddenright">',
                '<div class="spin-panel-hd">',
                    '<span class="spin-title"></span>',
                '</div>',
                '<div class="spin-panel-bd"></div>',
            '</li>'
        ].join('');

        panel = elPanels.appendChild(div.firstChild);
        setTitle(panel, cfg.title);
        setContent(panel, cfg.content);

        return panel;
    }

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
     * @param {Object} [cfg] Settings for the new panel
     * @param {String} [cfg.content] Panel content (html)
     * @param {String} [cfg.title] Panel title
     * @returns {HTMLElement}
     * @throws {Error} If cfg is passed and is not an object,
     *                 or if content is passed and is not a string,
     *                 or if title is passed and is not a string.
     */
    win.spin = spin = function (cfg) {
        var panel;

        if (!arguments.length) {
            cfg = {};
        }

        if (
            !isObject(cfg)
            || (cfg.hasOwnProperty('content') && !isString(cfg.content))
            || (cfg.hasOwnProperty('title') && !isString(cfg.title)) 
            ) {
            throw new Error('bad function call');
        }

        if (!cfg.content) {
            cfg.content = '';
        }

        if (!cfg.title) {
            cfg.title = '';
        }

        panel = appendPanel(cfg);

        moveTo(panel);
        return panel;
    };

    // Panel states
    spin.PANEL_HIDDENRIGHT = 'hiddenright';
    spin.PANEL_HIDDENLEFT  = 'hiddenleft';
    spin.PANEL_FULL        = 'full';
    spin.PANEL_BIG         = 'big';
    spin.PANEL_SMALL       = 'small';

    /**
     * Gets or sets the loader
     *
     * If called with no argument it returns the current loader.
     * If called with a function, it updates the loader with that function and returns the previous loader.
     *
     * @example
     * var fn1, fn2;
     *
     * // Dummy function
     * function newLoader() {
     * }
     *
     * // Returns current loader
     * fn1 = spin.loader();
     *
     * // Updates the current loader and returns the previous one
     * // So fn1 === fn2 is true
     * fn2 = spin.loader(newLoader);
     *
     * @name spin.loader
     * @function
     * @param {Function} [fn] The new loader
     * @returns {Function} Previous or current loader
     * @throws {Error} If called with an argument that is not a function
     */
    spin.loader = function (fn) {
        var prev = loader;
        if (!arguments.length) return loader;
        if (!isFunction(fn)) throw new Error("bad function call");
        loader = fn;
        return prev;
    };

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
    spin.getPanel = getPanel = function (elt) {
        if (
            !arguments.length
            || (
                !isElement(elt)
                && (!isString(elt) || !elt.trim())
                && (!isNumber(elt) || !isFinite(elt))
                )
            ) {
            throw new Error('bad function call');
        }

        if (isNumber(elt)) {
            elt = elPanels.childNodes[elt];
        }
        else if (isString(elt)) {
            elt = doc.getElementById(elt);
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
     * @name spin.getPanelState
     * @function
     * @param {Number|String|HTMLElement} elt
     * @returns {String} Current state of corresponding panel
     * @throws {Error} If panel has no state.
     * @see spin#PANEL_SMALL
     * @see spin#PANEL_BIG
     * @see spin#PANEL_FULL
     * @see spin#PANEL_HIDDENRIGHT
     * @see spin#PANEL_HIDDENLEFT
     */
    spin.getPanelState = getPanelState = function (elt) {
        var panel = getPanel(elt);
        var cls = panel.classList;
        if (cls.contains('spin-' + spin.PANEL_FULL)) return spin.PANEL_FULL;
        if (cls.contains('spin-' + spin.PANEL_BIG)) return spin.PANEL_BIG;
        if (cls.contains('spin-' + spin.PANEL_SMALL)) return spin.PANEL_SMALL;
        if (cls.contains('spin-' + spin.PANEL_HIDDENRIGHT)) return spin.PANEL_HIDDENRIGHT;
        if (cls.contains('spin-' + spin.PANEL_HIDDENLEFT)) return spin.PANEL_HIDDENLEFT;
        throw new Error('panel has no state');
    };

    /**
     * Moves to corresponding panel.
     *
     * @name spin.moveTo
     * @function
     * @param {Number|String|HTMLElement} elt
     * @returns {HTMLElement}
     * @throws 'panel not found'
     */
    spin.moveTo = moveTo = function (elt) {
        var dest,
            destState,
            panel,
            panelState,
            state,
            states;

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

        dest      = getPanel(elt);          // panel of destination
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

    /**
     * Deletes all panels after corresponding panel.
     *
     * @name spin.deleteAfter
     * @function
     * @param {Number|String|HTMLElement} elt
     * @returns {HTMLElement}
     * @throws 'panel not found'
     */
    spin.deleteAfter = deleteAfter = function (elt) {
        var panel = getPanel(elt);
        while ( elPanels.lastChild != panel ) {
            elPanels.removeChild(elPanels.lastChild);
        }
        return panel;
    };

    /**
     * @name spin.isNumber
     * @function
     * @param o
     * @returns {Boolean} True if o is a number. False otherwise.
     */
    spin.isNumber = isNumber = function (o) {
        return toString.call(o) == '[object Number]' && isFinite(o);
    };

    /**
     * @name spin.isFunction
     * @function
     * @param o
     * @returns {Boolean} True if o is a function. False otherwise.
     */
    spin.isFunction = isFunction = function (o) {
        return toString.call(o) == '[object Function]';
    };

    /**
     * @name spin.isObject
     * @function
     * @param o
     * @returns {Boolean} True if o is an object. False otherwise.
     */
    spin.isObject = isObject = function (o) {
        return toString.call(o) == '[object Object]';
    };

    /**
     * @name spin.isString
     * @function
     * @param o
     * @returns {Boolean} True if o is a string. False otherwise.
     */
    spin.isString = isString = function (o) {
        return toString.call(o) == '[object String]';
    };

    /**
     * @name spin.isElement
     * @function
     * @param o
     * @returns {Boolean} True if o is an element node. False otherwise.
     */
    spin.isElement = isElement = function (o) {
        return !!o && o.nodeType === 1;
    };

    /**
     * @name spin.isPanel
     * @function
     * @param o
     * @returns {Boolean} True if o is a panel. False otherwise.
     */
    spin.isPanel = isPanel = function (o) {
        return !!o && o.parentNode === elPanels;
    };

    /**
     * Default loader
     */
    loader = spin.xhrLoader = function (el) {
        var url, title;
        
        if (!isElement(el)) {
            throw new Error('bad function call');
        }
        
        url = el.dataset.url ? el.dataset.url.trim() : null;
        
        if (!url) {
            throw new Error('element has no url');
        }
        
        url = el.dataset.url.trim();

        if (el.dataset.title) {
            title = el.dataset.title;
        }
        else if (el.querySelector('.spin-title')) {
            title = el.querySelector('.spin-title').textContent;
        }
        else {
            title = el.textContent;
        }

        if (!spin.xhrLoader.xhr) {
            spin.xhrLoader.xhr = new XMLHttpRequest();

            //When request finishes
            spin.xhrLoader.xhr.addEventListener('load', function () {
                spin({ content: this.responseText, title: title });
                spin.xhrLoader.xhr = null;
            }, false);

            spin.xhrLoader.xhr.addEventListener('error', function () {
                spin.xhrLoader.xhr = null;
            }, false);
        }
        else {
            spin.xhrLoader.xhr.abort();
        }

        spin.xhrLoader.xhr.open('GET', url);
        spin.xhrLoader.xhr.send();
    };

    win.addEventListener('load', function () {
        dropBaseMarkup();
        registerClickHandler();
        registerAnimationEndHandler();
        loader(doc.body);
    }, false);

})(window, document);