var express = require('express');
var router = express.Router();

var transformation = require('../services/transformation.js');


const {Client} = require('pg');

const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

/* GET home page. */
router.get('/', function (req, res, next) {
    // transformation_result = client.query(
    //   "SELECT extraction FROM extractionresult LIMIT 1", (err, res) => {
    //     console.log(err);
    //     var transform = transformation.perform(res);
    //     return transform;
    //     }
    // );
JSON.stringify();
    client.query(
      // "INSERT INTO transformationresult (transformation) VALUES ($1) RETURNING id", ([transformation_result]), (err, res) => {

      "SELECT transformation FROM transformationresult LIMIT 1", (err, res) => {
        console.log(err);
        // console.log(res);
      }
    );

    res.redirect('/');
});

module.exports = router;
