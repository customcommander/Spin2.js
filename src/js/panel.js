
/**
 * Counter used to generate ids.
 * @private
 * @type {Number}
 */
var spinId = 0;

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
    panel.setError(pnl, cfg.error);
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
 * Sets or unsets a panel error state
 * @private
 * @param {HTMLElement} pnl corresponding dom element
 * @param {Boolean} err
 */
panel.setError = function (pnl, err) {
    if (err) {
        pnl.classList.add('error');
    } else {
        pnl.classList.remove('error');
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
    var panels = document.querySelector('#spin-panels');
    while ( panels.lastChild !== pnl ) {
        panels.removeChild(panels.lastChild);
    }
    return pnl;
};

/**
 * True if given panel is currently visible.
 * @private
 * @param {HTMLElement} pnl
 * @returns {Boolean}
 */
panel.isVisible = function (pnl) {
    var vis = panel.getVisibility(pnl);
    return vis === spin.PANEL_FULL ||
           vis === spin.PANEL_SMALL ||
           vis === spin.PANEL_BIG;
};

/**
 * Returns the current visibility state of given panel
 * @private
 * @param {HTMLElement} pnl
 * @returns {String}
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
 * @private
 * @param {HTMLElement} pnl
 * @param {String} vis the new visibility state
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
 * @private
 * @this {HTMLElement} panel
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
 * @private
 * @param {HTMLElement} pnl
 * @returns {Boolean}
 */
panel.isHome = function (pnl) {
    return pnl.previousSibling === null;
};

/**
 * True if given panel is the last one.
 * @private
 * @param {HTMLElement} pnl
 * @returns {Boolean}
 */
panel.isLast = function (pnl) {
    return pnl.nextSibling === null;
};

/**
 * Returns the panel following given panel.
 * @private
 * @param {HTMLElement} pnl
 * @returns {HTMLElement}
 */
panel.getNext = function (pnl) {
    return pnl.nextSibling;
};

/**
 * Returns the panel preceding given panel.
 * @private
 * @param {HTMLElement} pnl
 * @returns {HTMLElement}
 */
panel.getPrevious = function (pnl) {
    return pnl.previousSibling;
};
