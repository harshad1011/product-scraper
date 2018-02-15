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

    it('checks whether function throws error for null url', function () {
        scraper.productScraper(null, null, function (err, data) {
            expect(err).to.equal('Please provide a url to scrape from as first parameter.');
        });
    });

    it('checks whether scraper works with default sites', function () {
        scraper.productScraper('http://www.naturesbasket.co.in/Products/Organic-Tulsi-Green-Tea---25-TB---Organic-India/4054_0_0_0', null, function (err, data) {
            expect(data).to.have.any.keys('name', 'price', 'description');
        });
    });
});