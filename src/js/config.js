
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
