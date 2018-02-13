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

var parseUrl = function (url) {
    return url ? urlPkg.parse(url) : "";
}

var consolidateData = function ($, data, site) {
    var response = {};
    var value = data ? data : sites[site];

    if (value) {
        Object.keys(value).forEach(function (key, index) {
            response[key] = $(value[key]).text();
        });
    }
    return response;
}

module.exports = {
    parseUrl: parseUrl,
    consolidateData: consolidateData
};