const express = require('express');
const router = express.Router();
const transformation = require('../services/transformation.js');
const {Client} = require('pg');

const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

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
            let descs = transform[5];
            let transformation_json = JSON.stringify([titles, prices, descs]);
            transformation_save.push(transformation_json);
        })
        .then(() => client.query("DELETE FROM transformationresult"))
        .then(() => client.query("INSERT INTO TransformationResult(transformation) VALUES ($1)", transformation_save))
        .then(() => res.json({status: 'ready'}))
        .catch((err) => {
            console.log(err);
        });


});

module.exports = router;
