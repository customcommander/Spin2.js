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
        loader,     //Internal copy of the current loader
        el = {};    //DOM elements that we need to keep references of

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
        return isElement(o) && o.parentNode===el.panels;
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
        el.spin = doc.createElement('div');
        el.spin.id = 'spin';
        el.nav = doc.createElement('ol');
        el.nav.id = 'spin-nav';
        el.panels = doc.createElement('ol');
        el.panels.id = 'spin-panels';
        el.spin.appendChild(el.nav);
        el.spin.appendChild(el.panels);
        doc.body.appendChild(el.spin); 
    }

    function registerClickHandler(){
        el.panels.addEventListener('click', function (ev){
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

    /**
     * Returns possible widths for a panel
     *
     * @returns {Object} Object containing possible widths for a panel.
     *                   full: 100% of browser window width
     *                   min: 1/3 of browser window width
     *                   max: 2/3 of browser window width
     */
    function getPanelWidth(){
        var winWidth = win.innerWidth,
            minWidth = Math.floor(winWidth/3),
            maxWidth = Math.floor(winWidth-minWidth);
        return {
            full: winWidth,
            min:  minWidth,
            max:  maxWidth
        };
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

        // Panel Title
        panel.getElementsByClassName('spin-title')[0].innerHTML = o.title;

        // Panel Content
        if (isString(o.content)){
            panel.getElementsByClassName('spin-panel-bd')[0].innerHTML = o.content;
        } else {
            panel.getElementsByClassName('spin-panel-bd')[0].appendChild(o.content);
        }

        // Panel Position
        if (!el.panels.childNodes.length){
            panel.style.cssText = 'left:0px;width:'+win.innerWidth+'px;';
        } else {
            panel.style.cssText = 'left:'+win.innerWidth+'px;';
        }

        return el.panels.appendChild(panel);
    }
    
    /**
     * Appends a new panel and returns it
     *
     * @name window.spin
     * @function
     * @param {Object} [o] key/value pairs object
     * @returns {HTMLElement} panel
     * @throws {Error} If called with an argument that is not an object
     */
    win.spin = spin = function (o){
        var panel;

        if (!arguments.length) o = {};
        if (!isObject(o)) throw new Error('bad function call');

        if (!isString(o.title)) o.title = '';
        if (!isString(o.content) && !isElement(o.content)) o.content = '';

        panel = appendPanel(o);

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
            elt = el.panels.childNodes[elt];
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
        var panel = getPanel(elt);
        return panel;
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
        while ( el.panels.lastChild != panel ) {
            el.panels.removeChild(el.panels.lastChild);
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
                spin({
                    title: 'foo',
                    content: this.responseText,
                    referrer: el
                });
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
        loader(doc.body);
    }, false);

})(window, document);