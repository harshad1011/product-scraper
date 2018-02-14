var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var config = require('./config');
var args = process.argv;
var method = 'GET';

/**
 * This function writes output to standard output
 * @param {Object} data An object containing data to be printed on standard output
 */
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

/**
 * This function scrapes the data from given url & passes it onto callback function if provided
 * @param {String} url 
 * @param {Object} [data] Object containing keys & values for the data to be scraped from page. 
 * Values denote HTML elements or attributes like class/style/id & keys denote in what field the data of that element should be retrieved.
 * @param {Function} [cb] callback function to which error or data needs to be passed
 */
var scrape = function (url, data, cb) {

    var urlData = config.parseUrl(url);
    var jar = request.jar();

    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36'
        },
        jar: jar,
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

/**
 * This function prints help if --help/-h argument is mentioned in command line
 */
function printHelp() {
    console.log("Run this npm with command - node index.js --url / -u <<url of the product>>");
    console.log("Arguments accepted:");
    console.log("\t1. --help / -h: Provides help regarding how to run on command line");
    console.log("\t2. --url / -u << url_string >>: Specifies that next parameter is url to be scraped.");
    console.log("\t3. --data / -d << path_to_json_file >>: Specifies that next parameter is json file which contains data that needs to be scraped. If not specified npm searches for default sites.");
    console.log("\t4. --method / -m << url_request_method >>: Optional parameter which specifies what method to be used while making request to url. Default method is GET.");
}

/**
 * This function parses the arguments provided if npm is run on command line.
 * Arguments accepted:
 *  # --help/-h: Provides help regarding how to run on command line
 *  # --url/-u <<url_string>>: Specifies that next parameter is url to be scraped
 *  # --data/-d <<path_to_json_file>>: Specifies that next parameter is json file which contains data that needs to be scraped
 *  # --method/-m <<url_method>>: Optional parameter which specifies what method to be used while making request to url
 */
function parseArgs() {
    if (args.length < 3 || (args.indexOf('--url') < 0 &&
            args.indexOf('-u') < 0)) {
        printHelp();
        return;
    }

    if (args.indexOf('--help') >= 2 ||
        args.indexOf('-h') >= 2) {
        printHelp();
    }

    var methodIdx = args.indexOf('--method') >= 2 ? args.indexOf('--method') : args.indexOf('-m');
    if (methodIdx >= 2) {
        method = args[methodIdx + 1];
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
}

parseArgs();

module.exports = {
    productScraper: scrape
};