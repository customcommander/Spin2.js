/**
 * Spin.js - User Interface For Web Applications
 * @fileoverview This is the source code for Spin.js
 * @author Julien Gonzalez
 */
(function (window, doc) {

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

    if (window.spin) {
        throw new Error('spin already exists');
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
        elSpin   = doc.body.appendChild(outer.firstChild);
        elNav    = elSpin.firstChild;
        elPanels = elSpin.lastChild;
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
                spin({
                    url: t.dataset.url,
                    title: t.dataset.title
                });
                t.classList.add('loaded');
            } else {
                spin.moveTo(spin.getPanel(t).nextSibling);
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
     * Validates the panel configuration object
     * @private
     * @throws {Error}
     * @returns {Boolean} Returns true if cfg passes validation
     */
    function validateConfig(cfg) {
        if (!isObject(cfg)) {
            throw new Error('cfg is not an object');
        }
        if (cfg.hasOwnProperty('title') && !isString(cfg.title)) {
            throw new Error('cfg.title is not a string');
        }
        if (cfg.hasOwnProperty('content') && !isString(cfg.content)) {
            throw new Error('cfg.content is not a string');
        }
        if (cfg.hasOwnProperty('url') && (!isString(cfg.url) || !cfg.url.trim())) {
            throw new Error('cfg.url is not a valid string');
        }
        return true;
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

        div.innerHTML =
            '<li id="spin-id'+spinId+'" class="spin-panel spin-hiddenright">' +
                '<div class="spin-panel-hd"></div>' +
                '<div class="spin-panel-bd"></div>' +
            '</li>';

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
    window.spin = function (cfg) {
        var panel;

        if (!arguments.length) {
            cfg = {};
        }

        validateConfig(cfg);

        if (!cfg.content) {
            cfg.content = '';
        }

        if (!cfg.title) {
            cfg.title = '';
        }

        if (cfg.url && elPanels.lastChild && elPanels.lastChild.classList.contains('loading')) {
            panel = elPanels.lastChild;
            setTitle(panel, cfg.title);
            setContent(panel, cfg.content);
        }
        else {
            panel = appendPanel(cfg);
            if (cfg.url) {
                panel.classList.add('loading');
            } else {
                spin.moveTo(panel);
                return panel;
            }
        }

        if (spin.xhr instanceof XMLHttpRequest) {
            spin.xhr.abort();
            delete spin.xhr;
        }

        spin.xhr = new XMLHttpRequest();

        spin.xhr.addEventListener('load', function () {
            setContent(panel, this.responseText);
            panel.classList.remove('loading');
        }, false);

        spin.xhr.open('GET', cfg.url);
        spin.xhr.send();

        spin.moveTo(panel);

        return panel;
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
    spin.getPanelState = function (elt) {
        var panel = spin.getPanel(elt);
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
    spin.moveTo = function (elt) {
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
            var curState = spin.getPanelState(panel);

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
        destState = spin.getPanelState(dest);    // current state of destination panel

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
            } while (panel && spin.getPanelState(panel) != spin.PANEL_HIDDENLEFT);
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
            } while (panel && spin.getPanelState(panel) != spin.PANEL_HIDDENRIGHT);
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
    spin.deleteAfter = function (elt) {
        var panel = spin.getPanel(elt);
        while ( elPanels.lastChild != panel ) {
            elPanels.removeChild(elPanels.lastChild);
        }
        return panel;
    };

    window.addEventListener('load', function () {
        dropBaseMarkup();
        registerClickHandler();
        registerAnimationEndHandler();
        spin({
            title: doc.body.dataset.title,
            url: doc.body.dataset.url
        });
    }, false);

})(window, document);