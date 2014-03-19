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