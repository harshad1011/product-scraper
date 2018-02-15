var mocha = require('mocha');
var expect = require('chai').expect;
var scraper = require('./index');

describe('tests the scrape function', function () {
    it('scrapes the given data in url', function () {
        var testData = {
            "name": ".LinesEllipsis",
            "price": ".pdp-product__price--new",
            "description": ".product-attributes__attr--description"
        };

        scraper.productScraper('https://grofers.com/prn/kiwi-imported/prid/381783', testData, function (err, data) {
            expect(Object.keys(data)).to.deep.equal(Object.keys(testData));
        });
    });
});