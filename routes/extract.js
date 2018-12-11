var express = require('express');
var router = express.Router();
const cheerio = require('cheerio')
var extraction = require('../services/extraction.js')

const {Client} = require('pg');
const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

router.post('/', async function (req, res, next) {

        let uri = `https://www.gumtree.pl/s-nieruchomosci/krakow/v1c2l3200208p1`;
        const bodies = [];
        for(let i = 0; i < 3; i++) {
            const body = await extraction.perform(uri);
            bodies.push(body);
            let $ = cheerio.load(body);
            uri = $('.next.follows')[0].attribs.href;
            uri = `https://www.gumtree.pl${uri}`;
        }

        await client.query("DELETE FROM extractionresult");
        await client.query(
            "INSERT INTO extractionresult (extraction) VALUES ($1) RETURNING id",
            [JSON.stringify(bodies)]
        );
        res.json({status: 'ready'})
});

module.exports = router;
