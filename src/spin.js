/**
 * Spin.js - User Interface For Web Applications
 * @fileoverview This is the source code for Spin.js
 * @author Julien Gonzalez
 */
(function (win, doc) {

    var toString = Object.prototype.toString,
        isNumber,
        spinId = 0,
        spin,       //Internal copy of window.spin
        getPanel,
        moveTo,
        deleteAfter,
        loader;     //Internal copy of the current loader

    /**
     * Reference to #spin node
     * @private
     * @type {HTMLElement}
     */
    var elSpin;

    /**
     * Reference to #spin-nav node
     * @private
     * @type {HTMLElement}
     */
    var elNav;

    /**
     * Reference to #spin-panels node
     * @private
     * @type {HTMLElement}
     */
    var elPanels;

    if (win.spin){
        throw new Error('spin already exists');
    }

    function isNumber(o){
        return toString.call(o) == '[object Number]';
    }

    function isFunction(o){
        return toString.call(o) == '[object Function]';
    }

    function isObject(o){
        return toString.call(o) == '[object Object]';
    }

    function isUndefined(o){
        return toString.call(o) == '[object Undefined]';
    }

    function isString(o){
        return toString.call(o) == '[object String]';
    }

    function isBoolean(o){
        return toString.call(o) == '[object Boolean]';
    }

    function isNonEmptyString(o){
        return isString(o) && o.trim();
    }

    function isElement(o){
        return o && o.nodeType===1;
    }

    function isPanel(o){
        return isElement(o) && o.parentNode===elPanels;
    }

    /*
     * Generates and appends the base markup to the document body.
     * 
     *  <div id="spin">
     *      <ol id="spin-nav"/>
     *      <ol id="spin-panels"/>
     *  </div>
     */
    function dropBaseMarkup(){
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

    function registerClickHandler(){
        elPanels.addEventListener('click', function (ev){
            var t = ev.target;
            if (!t.classList.contains('nav')){
                return;
            }
            if (!t.classList.contains('loaded')){
                loader(t);
                t.classList.add('loaded');
            }
        }, false);
    }

    /*
     *
     *
     */
    function appendPanel(o){
        var panel = doc.createElement('li');

        // Panel Markup
        panel.innerHTML = 
              '<div class="spin-panel-hd">'
            + '    <span class="spin-title"></span>'
            + '</div>'
            + '<div class="spin-panel-bd"></div>';

        // Panel ID
        spinId++;
        panel.id = 'spin-id'+spinId;

        // Panel CSS Class
        panel.classList.add('spin-panel');
        panel.classList.add('spin-hiddenright');

        // Panel Title
        panel.getElementsByClassName('spin-title')[0].innerHTML = o.title;

        // Panel Content
        if (isString(o.content)){
            panel.getElementsByClassName('spin-panel-bd')[0].innerHTML = o.content;
        } else {
            panel.getElementsByClassName('spin-panel-bd')[0].appendChild(o.content);
        }

        doc.getElementById('spin-panels').appendChild(panel);

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
    win.spin = spin = function (cfg){
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
        if (!arguments.length
            || (
                !isElement(elt)
                && (!isString(elt) || !elt.trim())
                && (!isNumber(elt) || !isFinite(elt))
            )) {
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

        ret = panel = getPanel(elt);

        function isSmall(panel) {
            return panel.classList.contains('spin-small');
        }

        function isBig(panel) {
            return panel.classList.contains('spin-big');
        }

        function isFull(panel) {
            return panel.classList.contains('spin-full');
        }

        function isHiddenLeft(panel) {
            return panel.classList.contains('spin-hiddenleft');
        }

        function isHiddenRight(panel) {
            return panel.classList.contains('spin-hiddenright');
        }

        function getState(panel) {
            if (isHiddenRight(panel)) return 'hiddenright';
            if (isBig(panel)) return 'big';
            if (isSmall(panel)) return 'small';
            if (isFull(panel)) return 'full';
            if (isHiddenLeft(panel)) return 'hiddenleft';
            throw new Error('panel has no state');
        }

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

        if (isBig(panel) || isFull(panel)) {
            return ret;
        }

        if (isHiddenRight(panel)) {
            if (!panel.previousSibling) {
                states = ['full'];
            } else {
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
            } else {
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
    loader = spin.xhrLoader = function (el){
        var url;
        
        if (!el || el.nodeType!==1){
            throw new Error('invalid argument');
        }
        
        url = el.dataset.url ? el.dataset.url.trim() : null;
        
        if (!url){
            throw new Error('element has no data-url attribute');
        }
        
        url = el.dataset.url.trim();

        if (!spin.xhrLoader.xhr){
            spin.xhrLoader.xhr = new XMLHttpRequest();

            //When request finishes
            spin.xhrLoader.xhr.addEventListener('load', function () {
                spin({ content: this.responseText });
            }, false);

            spin.xhrLoader.xhr.addEventListener('error', function () {
            }, false);
        } else {
            spin.xhrLoader.xhr.abort();
        }

        spin.xhrLoader.xhr.open('GET', url);
        spin.xhrLoader.xhr.send();
    };

    win.addEventListener('load', function (){
        dropBaseMarkup();
        registerClickHandler();
        registerAnimationEndHandler();
        loader(doc.body);
    }, false);

})(window, document);