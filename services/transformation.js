const cheerio = require('cheerio');

module.exports = {
  perform: function (parsed_page) {
    var $ = cheerio.load(parsed_page);
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

      return [listOfTitles, listOfPrices, urls];
  }
};
