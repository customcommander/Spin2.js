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
        moveTo,
        deleteAfter,
        loader;     //Internal copy of the current loader

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
     * Checks that argument is a number
     * @private
     */
    function isNumber(o) {
        return toString.call(o) == '[object Number]';
    }

    /**
     * Checks that argument is a function
     * @private
     */
    function isFunction(o) {
        return toString.call(o) == '[object Function]';
    }

    /**
     * Checks that argument is an object
     * @private
     */
    function isObject(o) {
        return toString.call(o) == '[object Object]';
    }

    /**
     * Checks that argument is undefined
     * @private
     */
    function isUndefined(o) {
        return toString.call(o) == '[object Undefined]';
    }

    /**
     * Checks that argument is a string
     * @private
     */
    function isString(o) {
        return toString.call(o) == '[object String]';
    }

    /**
     * Checks that argument is a boolean
     * @private
     */
    function isBoolean(o) {
        return toString.call(o) == '[object Boolean]';
    }

    /**
     * Checks that argument is a html element
     * @private
     */
    function isElement(o) {
        return o && o.nodeType === 1;
    }

    /**
     * Checks that argument is a panel
     * @private
     */
    function isPanel(o) {
        return o && o.parentNode === elPanels;
    }

    /**
     * Checks that panel is in a small state
     * @private
     */
    function isSmall(panel) {
        return panel.classList.contains('spin-small');
    }

    /**
     * Checks that panel is in a big state
     * @private
     */
    function isBig(panel) {
        return panel.classList.contains('spin-big');
    }

    /**
     * Checks that panel is in a full state
     * @private
     */
    function isFull(panel) {
        return panel.classList.contains('spin-full');
    }

    /**
     * Checks that panel is in a hidden state (on the left)
     * @private
     */
    function isHiddenLeft(panel) {
        return panel.classList.contains('spin-hiddenleft');
    }

    /**
     * Checks that panel is in a hidden state (on the right)
     * @private
     */
    function isHiddenRight(panel) {
        return panel.classList.contains('spin-hiddenright');
    }

    /**
     * Returns panel current state
     * @private
     */
    function getState(panel) {
        if (isHiddenRight(panel)) return 'hiddenright';
        if (isBig(panel)) return 'big';
        if (isSmall(panel)) return 'small';
        if (isFull(panel)) return 'full';
        if (isHiddenLeft(panel)) return 'hiddenleft';
        throw new Error('panel has no state');
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
     * Creates and appends a panel into the DOM
     * @private
     * @param {Object} o Panel configuration
     * @returns {HTMLElement} The panel that has been created
     */
    function appendPanel(o) {
        var panel, header, body;

        panel = doc.createElement('li'),

        spinId++;
        panel.id = 'spin-id'+spinId;
        panel.className = 'spin-panel spin-hiddenright';

        header = doc.createElement('div');
        header.className = 'spin-panel-hd';
        header.innerHTML = '<span class="spin-title">' + o.title + '</span>';

        body = doc.createElement('div');
        body.className = 'spin-panel-bd';
        body.innerHTML = o.content;

        panel.appendChild(header);
        panel.appendChild(body);

        elPanels.appendChild(panel);

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
     * Moves to corresponding panel.
     *
     * @name spin.moveTo
     * @function
     * @param {Number|String|HTMLElement} elt
     * @returns {HTMLElement}
     * @throws 'panel not found'
     */
    spin.moveTo = moveTo = function (elt) {
        var ret,
            panel,
            states,
            nextState;

        function move(panel, nextState) {
            var curState = getState(panel);
            if (curState[0] == nextState[0]) {
                panel.classList.remove('spin-' + curState);
                panel.classList.add('spin-' + nextState);
            }
            else {
                panel.classList.add('spin-' + curState + '-' + nextState);
            }
        }

        ret = panel = getPanel(elt);

        if (isBig(panel) || isFull(panel)) {
            return ret;
        }

        if (isHiddenRight(panel)) {
            if (!panel.previousSibling) {
                states = ['full'];
            }
            else {
                states = ['big', 'small'];
            }
            do {
                nextState = states.shift() || 'hiddenleft';
                move(panel, nextState);
                panel = panel.previousSibling;
            } while (panel && !isHiddenLeft(panel));
        }
        else {
            if (!panel.previousSibling) {
                states = ['full'];
            }
            else {
                states = ['small', 'big'];
                panel  = panel.previousSibling;
            }
            do {
                nextState = states.shift() || 'hiddenright';
                move(panel, nextState);
                panel = panel.nextSibling;
            } while (panel && !isHiddenRight(panel));
        }

        return ret;
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