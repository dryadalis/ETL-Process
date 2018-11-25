var express = require('express');
var router = express.Router();

var exp = require('./extract.js');

const rp = require('request-promise');
const cheerio = require('cheerio');
const {Client} = require('pg');


const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'
const queries = 'INSERT INTO Realestate(Title, Price) VALUES($1, $2)';

//Connect to postgresql
const client = new Client({
    connectionString: connectionString,
})

client.connect()

/* GET home page. */
router.get('/', function (req, res) {
    const options = {
        uri: `https://www.gumtree.pl/s-nieruchomosci/krakow/v1c2l3200208p1`,
        transform: function (body) {
            return cheerio.load(body);
        }
    }

    rp(options)
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

            for (let i = 0; i < listOfTitles.length; i++) {
                await client.query(queries, [listOfTitles[i], listOfPrices[i]])
            }

        })
        .then((err) => {
            if (err) throw err;
                client.query("SELECT title, price FROM realestate", (err, response) => {
                    if (err) throw err;
                    const titles = response.rows;
                    const prices = response.rows;
                    const arr = [];

                    for (let i = 0; i < titles.length; i++) {
                        arr.push([titles[i].title, prices[i].price]);
                    }

                    res.render('layout', {
                        data: arr,
                    })
                })
        })
        .catch((error) => {
            console.log(error)
        });
});

module.exports = router;
