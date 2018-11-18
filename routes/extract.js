var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const cheerio = require('cheerio');
var result = [];
//
// /* GET home page. */
router.get('/', function (req, res, next) {
    const options = {
        uri: `https://www.gumtree.pl/s-nieruchomosci/krakow/v1c2l3200208p1`,
        transform: function (body) {
            return cheerio.load(body);
        }
    }
      result = rp(options)
          .then(async ($) => {
              const titles = $('.result-link').find('.title');
              const prices = $('.result-link').find('.amount');
              const urls = $('.result-link').find('.href-link');

              let links = [];
              for (let i = 0; i < urls.length; i++) {
                  links.push(urls[i].attribs.href)
              }

              const listOfTitles = titles.each(function (i) {
                  titles[i] = $(this).text().trim();
              });
              const listOfPrices = prices.each(function (i) {
                  prices[i] = $(this).text().trim();
                  prices[i] = prices[i].replace('zł', '')
              });

              // for (let i = 0; i < listOfTitles.length; i++) {
              //     await client.query(queries, [listOfTitles[i], listOfPrices[i]])
              // }
              return [listOfTitles, listOfPrices, urls];
          })
    res.send(result);
});

module.exports = router;
