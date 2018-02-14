# product-scraper

## Description
This npm is developed for basic scraping of E-Commerce platforms like Grofers, Big Basket, Nature's Basket.
It can also be used for customized scraping of any URL, given the json object. See examples for explaination.

## APIs
1. productScraper: This API takes 3 parameters.
   - First parameter is url in string type.
   - Second parameter is meta-data, which is used to scrape custom data from given url. This parameter is optional.
   - Third parameter is callback function to which takes argument error & data.

## Examples
Running npm via command line
`node index.js -u http://www.naturesbasket.co.in/Products/Organic-Tulsi-Green-Tea---25-TB---Organic-India/4054_0_0_0 -p`

Importing npm as a node module:
```
var ps = require('product-scraper');
ps.productScraper("https://grofers.com/prn/bitter-gourd-karela/prid/197969", {
    "name": ".LinesEllipsis",
    "price": ".pdp-product__price--new"
}, function (err, data) {
    if (err) {
        console.error(err);
    } else if (data) {
        Object.keys(data).forEach(function (key) {
            console.log(data[key]);
        });
    } else {
        console.error("No response received");
    }
});
```