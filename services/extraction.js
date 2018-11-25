const cheerio = require('cheerio');
const rp = require('request-promise');

 module.exports = {
  perform: function () {
    const options = {
        uri: `https://www.gumtree.pl/s-nieruchomosci/krakow/v1c2l3200208p1`
    }

    promise = rp(options)
        .then(function(body) {
            return body;
    });
    return promise;
  }
};
