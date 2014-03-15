
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
 * @param {Boolean}                   [cfg.error]   - If given will create an error panel
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
 * @param {Number|HTMLElement|String} elt
 * @returns {HTMLElement}
 * @throws {Error} 'bad function call'
 * @throws {Error} 'panel not found'
 */
spin.getPanel = function (elt) {
    if (!isNumber(elt) && !isElement(elt) && !isString(elt)) {
        throw new Error('bad function call');
    }
    if (isNumber(elt)) {
        elt = document.querySelector('#spin-panels').childNodes[elt];
    } else if (isString(elt)) {
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
