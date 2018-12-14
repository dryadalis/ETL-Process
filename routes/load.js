const express = require('express');
const router = express.Router();
const loading = require('../services/loading.js');
const {Client} = require('pg');
const connectionString = 'postgres://ppbqhddekvzfau:d1a2238abc077848c9e922e7b14855b616b6be4e62ccf32baa65c2c67198776a@ec2-46-51-184-66.eu-west-1.compute.amazonaws.com:5432/dfem24oqv2gjut?ssl=true'

const client = new Client({
    connectionString: connectionString,

});

client.connect();

router.post('/', async function (req, res) {
    const dbRes = await client.query("SELECT transformation FROM transformationresult LIMIT 1")
    const transformation_result = JSON.parse(dbRes.rows[0].transformation);
    const titles = transformation_result[0];
    const prices = transformation_result[1];
    const dataOfAddition = transformation_result[2];

    const allLoadedData = titles.length + prices.length + dataOfAddition.length;
    await loading.perform(titles, prices, client, dataOfAddition);
    await client.query("DELETE FROM transformationresult");
    res.json({status: 'ready', amount: allLoadedData});
});

module.exports = router;
