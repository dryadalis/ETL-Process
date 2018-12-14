const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const extraction = require('../services/extraction.js');

const {Client} = require('pg');
const connectionString = 'postgres://ppbqhddekvzfau:d1a2238abc077848c9e922e7b14855b616b6be4e62ccf32baa65c2c67198776a@ec2-46-51-184-66.eu-west-1.compute.amazonaws.com:5432/dfem24oqv2gjut?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

router.post('/:city', async function (req, res,) {
        const { city } = req.params;
        const urls = {
            krakow: "https://www.gumtree.pl/s-nieruchomosci/krakow/v1c2l3200208p1",
            rzeszow: "https://www.gumtree.pl/s-nieruchomosci/rzeszow/v1c2l3200252p1",
            warsaw: "https://www.gumtree.pl/s-nieruchomosci/warszawa/v1c2l3200008p1",
            wroclaw: "https://www.gumtree.pl/s-nieruchomosci/wroclaw/v1c2l3200114p1"
        };
        let uri = urls[city];
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
        res.json({status: 'ready', amount: bodies.length});
});

module.exports = router;
