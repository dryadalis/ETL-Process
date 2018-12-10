const express = require('express');
const router = express.Router();
const extraction = require('../services/extraction.js')
const transformation = require('../services/transformation.js')
const loading = require('../services/loading.js')

const {Client} = require('pg');


const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

const client = new Client({
    connectionString: connectionString,
})

client.connect()

router.post('/', function (req, res) {

  let extract = extraction.perform();

    extract
        .then(function (extraction_result) {
        const transform = transformation.perform(extraction_result);

        return transform;
        })
        .then(function (transformation_result) {
            const titles = transformation_result[0];
            const prices = transformation_result[1];

            loading.perform(titles, prices, client);
        })
        .catch((err) => {
        console.log(err);
    });
    res.json({status: 'ready'});
});

module.exports = router;
