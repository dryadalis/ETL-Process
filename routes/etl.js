const express = require('express');
const router = express.Router();
const extraction = require('../services/extraction.js')
const transformation = require('../services/transformation.js')
const loading = require('../services/loading.js')
const cheerio = require('cheerio')

const {Client} = require('pg');


const connectionString = 'postgres://ppbqhddekvzfau:d1a2238abc077848c9e922e7b14855b616b6be4e62ccf32baa65c2c67198776a@ec2-46-51-184-66.eu-west-1.compute.amazonaws.com:5432/dfem24oqv2gjut?ssl=true'


const client = new Client({
    connectionString: connectionString,
})

client.connect()

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
    let transformation_save = [];

    await client.query("SELECT extraction FROM extractionresult LIMIT 1")
        .then(async function (extraction_result) {
            let transform = await transformation.perform(extraction_result.rows[0].extraction);
            let titles = transform[3];
            let prices = transform[4];
            let dataOfAddition = transform[5];
            let locations = transform[6];
            let loaner = transform[7];
            let size = transform[8];
            let numberOfRooms = transform[9];

            let transformation_json = JSON.stringify([titles, prices, dataOfAddition, locations, loaner, size, numberOfRooms]);
            transformation_save.push(transformation_json);
        })
        .then(() => client.query("DELETE FROM transformationresult"))
        .then(() => client.query("INSERT INTO TransformationResult(transformation) VALUES ($1)", transformation_save))
        .catch((err) => {
            console.log(err);
        });
    const dbRes = await client.query("SELECT transformation FROM transformationresult LIMIT 1")
    const transformation_result = JSON.parse(dbRes.rows[0].transformation);
    const titles = transformation_result[0];
    const prices = transformation_result[1];
    const dataOfAddition = transformation_result[2];
    const locations = transformation_result[3];
    const loaner = transformation_result[4];
    const size = transformation_result[5];
    const numberOfRooms = transformation_result[6];

    const allEtlData = titles.length + prices.length + dataOfAddition.length + locations.length + size.length + numberOfRooms.length;

    await loading.perform(titles, prices, client, dataOfAddition, locations, loaner, size, numberOfRooms);
    await client.query("DELETE FROM transformationresult");

    res.json({status: 'ready', amountB: bodies.length, amountAll: allEtlData});

});

module.exports = router;
