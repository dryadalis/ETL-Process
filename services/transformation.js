const cheerio = require('cheerio');
const rp = require('request-promise');


 module.exports = {
  perform: async function (pardes_bodies) {
      let pure_titles = [];
      let pure_prices = [];
      let titles = []
      let prices = [];
      let links = [];
      let urls = [];
      let listOfTitles = [];
      let listOfPrices = []
      const bodies = JSON.parse(pardes_bodies);

      for(let i = 0; i < bodies.length; i++) {
          const parsed_page = bodies[i];
          let $ = cheerio.load(parsed_page);
          let tmpti = $('.result-link').find('.title')
          let tempP =  $('.result-link').find('.amount')

          titles = titles.concat($('.result-link').find('.title'));
          prices = prices.concat($('.result-link').find('.amount'));

          const urlstemp = $('.result-link').find('.href-link');
          urls = urls.concat(urlstemp);


          const listOfTitlesT = tmpti.each(function (i) {
              tmpti[i] = $(this).text().trim();
              pure_titles.push(tmpti[i]);
          });

          listOfTitles = listOfTitles.concat(listOfTitlesT)
          const listOfPricesT = tempP.each(function (i) {
              tempP[i] = $(this).text().trim();
              tempP[i] = tempP[i].replace('zł', '');
              pure_prices.push(tempP[i]);
          });

          listOfPrices = listOfPrices.concat(listOfPricesT)


          let linkstemp = []
          for (let i = 0; i < urlstemp.length; i++) {
              linkstemp.push(urlstemp[i].attribs.href)
          }
          links = links.concat(linkstemp)
      }
      const results = await Promise.all(links.map(async (link) => {
          return rp({ uri: `https://www.gumtree.pl${link}` })
            .then(body => {
              const a = cheerio.load(body);
              const dataOfAddition = a('.selMenu').find('.value').first().text().trim();
              return dataOfAddition;
          })
      }));

       return [listOfTitles, listOfPrices, urls, pure_titles, pure_prices, results];
  }
};
