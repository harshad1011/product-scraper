var urlPkg = require('url');

var sites = {
    'www.naturesbasket.co.in': {
        name: '.pd_Title',
        price: '.search_PSellingP',
        description: '#divShortDesc'
    },
    'grofers.com': {
        name: '.LinesEllipsis',
        price: '.pdp-product__price--new',
        description: '.product-attributes__attr--description'
    },
    'www.bigbasket.com': {
        name: 'h1',
        price: '.uiv2-price',
        description: 'p'
    }
}

/**
 * Parses given string with default 'url' package
 * @param {String} url url to be parsed
 */
var parseUrl = function (url) {
    return url ? urlPkg.parse(url) : "";
}

/**
 * 
 * @param {Object} $ Object containing HTML response loaded by cheerio
 * @param {Object} [data] If specifed, custom data in which response needs to be formatted
 * @param {String} [site] If specifed, scrapes the data configured from default sites
 */
var consolidateData = function ($, data, site) {
    var response = {};
    var value = data ? data : sites[site];

    if (value) {
        Object.keys(value).forEach(function (key, index) {
            if (key.toLowerCase() == 'price') {
                response[key] = parseInt($(value[key]).text().match(/\d+/)[0]);
            } else {
                response[key] = $(value[key]).text();
            }
        });
    }
    return response;
}

module.exports = {
    parseUrl: parseUrl,
    consolidateData: consolidateData
};