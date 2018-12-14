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
        let listOfPrices = [];
        let dateOfAddition = [];
        let locations = [];
        let loaner = [];
        let size = [];
        let numberOfRooms = [];
        const bodies = JSON.parse(pardes_bodies);

        for (let i = 0; i < bodies.length; i++) {
            const parsed_page = bodies[i];
            let $ = cheerio.load(parsed_page);
            let tmpti = $('.result-link').find('.title')
            let tempP = $('.result-link').find('.amount')

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
        await Promise.all(links.map(async (link) => {
            return rp({uri: `https://www.gumtree.pl${link}`})
                .then(body => {
                    const a = cheerio.load(body);
                    dateOfAddition.push(a('.selMenu').find('.value').first().text().trim());
                    locations.push(a('.selMenu').find('.value').eq(1).text().trim());
                    loaner.push(a('.selMenu').find('.value').eq(2).text().trim());

                    size.push(a('span:contains("Wielkość")').next().text().trim());
                    numberOfRooms.push(a('span:contains("Liczba pokoi")').next().text().trim());
        }));

        return [urls, pure_titles, pure_prices, dateOfAddition, locations, loaner, size, numberOfRooms];

    }
};
