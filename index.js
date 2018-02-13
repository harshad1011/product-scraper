var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var config = require('./config');
var args = process.argv;
var method = 'GET';

var printData = function (data) {
    if (args.indexOf('--print') >= 2 ||
        args.indexOf('-p') >= 2) {
        console.log("\n====== Product Details =====");
        if (data) {
            Object.keys(data).forEach(function (key, index) {
                console.log(key.toUpperCase() + ": " + data[key]);
            });
        } else {
            console.log("No product details found. Please try again");
        }
    }
}

var scrape = function (url, data, cb) {

    var urlData = config.parseUrl(url);

    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36'
        },
        resolveWithFullResponse: true,
        method: method,
        transform: function (body, error) {
            return cheerio.load(body);
        }
    };

    rp(options).then(function ($) {
        var response = {};

        if (data) {
            response = config.consolidateData($, data, null);
        } else {
            response = config.consolidateData($, null, urlData.host);
        }
        printData(response);

        cb && cb(null, response);
    }).catch(function (err) {
        console.error(err);
        cb && cb(err, null);
    });
}

function printHelp() {
    console.log("Run this npm with command - node index.js <<url of the product>>");
}

function parseArgs() {
    if (args.length < 3) {
        printHelp();
        return;
    }

    if (args.indexOf('--help') >= 2 ||
        args.indexOf('-h') >= 2) {
        printHelp();
    }

    var urlIdx = args.indexOf('--url') >= 2 ? args.indexOf('--url') : args.indexOf('-u');
    if (urlIdx >= 2) {
        var dataIdx = args.indexOf('--data') >= 2 ? args.indexOf('--data') : args.indexOf('-d');
        if (dataIdx >= 2) {
            var obj;
            fs.readFile(args[dataIdx + 1], 'utf8', function (err, data) {
                if (err) {
                    throw err
                };
                obj = JSON.parse(data);
                scrape(args[urlIdx + 1], obj, null);
            });
        } else {
            scrape(args[urlIdx + 1], null, null);
        }
    } else {
        printHelp();
        return;
    }

    var methodIdx = args.indexOf('--method') >= 2 ? args.indexOf('--method') : args.indexOf('-m');
    if (methodIdx >= 2) {
        method = args[methodIdx + 1];
    }
}

parseArgs();

module.exports = {
    productScraper: scrape
};