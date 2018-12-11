
const express = require('express');
const router = express.Router();

const loading = require('../services/loading.js');

const {Client} = require('pg');

const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

router.post('/', async function (req, res) {
    const dbRes = await client.query("SELECT transformation FROM transformationresult LIMIT 1")
    const transformation_result = JSON.parse(dbRes.rows[0].transformation);
    const titles = transformation_result[0];
    const prices = transformation_result[1];
    const descs = transformation_result[2];
    await loading.perform(titles, prices, client, descs);
    await client.query("DELETE FROM transformationresult");
    res.json({status: 'ready'});


});

module.exports = router;
