const cheerio = require('cheerio');
jQuery = require('jQuery');

 module.exports = {
  perform: function (parsed_page) {
    var $ = cheerio.load(parsed_page);
    let pure_titles = [];
    let pure_prices = [];

      const titles = $('.result-link').find('.title');
      const prices = $('.result-link').find('.amount');
      const urls = $('.result-link').find('.href-link');
       let links = [];
      for (let i = 0; i < urls.length; i++) {
          links.push(urls[i].attribs.href)
      }
       const listOfTitles = titles.each(function (i) {
          titles[i] = $(this).text().trim();
          pure_titles.push(titles[i]);
      });
      const listOfPrices = prices.each(function (i) {
          prices[i] = $(this).text().trim();
          prices[i] = prices[i].replace('zł', '')
          pure_prices.push(prices[i]);
      });

       return [listOfTitles, listOfPrices, urls, pure_titles, pure_prices];
  }
};
