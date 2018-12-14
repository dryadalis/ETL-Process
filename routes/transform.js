const express = require('express');
const router = express.Router();
const transformation = require('../services/transformation.js');
const {Client} = require('pg');

const connectionString = 'postgres://ppbqhddekvzfau:d1a2238abc077848c9e922e7b14855b616b6be4e62ccf32baa65c2c67198776a@ec2-46-51-184-66.eu-west-1.compute.amazonaws.com:5432/dfem24oqv2gjut?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

router.post('/', async function (req, res) {
    let transformation_save = [];

    await client.query("SELECT extraction FROM extractionresult LIMIT 1")
        .then(async function (extraction_result) {
            let transform = await transformation.perform(extraction_result.rows[0].extraction);
            let titles = transform[3];
            let prices = transform[4];
            let dataOfAddition = transform[5];
            let transformation_json = JSON.stringify([titles, prices, dataOfAddition]);
            transformation_save.push(transformation_json);
            let allTransformetData = prices.length + titles.length + dataOfAddition.length;
            res.json({amount: allTransformetData});
        })
        .then(() => client.query("DELETE FROM transformationresult"))
        .then(() => client.query("INSERT INTO TransformationResult(transformation) VALUES ($1)", transformation_save))
        .then(() => res.json({status: 'ready'}))
        .catch((err) => {
            console.log(err);
        });


});

module.exports = router;
