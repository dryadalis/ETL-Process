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
    let transformation_save = [];

    client.query(
      "SELECT extraction FROM extractionresult LIMIT 1", (err, res) => {
        return res;
        }
      )
      .then(function(extraction_result) {
        let transform = transformation.perform(extraction_result.rows[0].extraction);
        let titles = transform[3];
        let prices = transform[4];

        let transformation_json = JSON.stringify([titles, prices]);
        transformation_save.push(transformation_json);
      });

      client.query("DELETE FROM transformationresult", (err, res) => {
          console.log(err);
        }
      );

      client.query(
        "INSERT INTO TransformationResult(transformation) VALUES ($1)", (transformation_save), (err, res) => {

          console.log(res);
          return res;
        }
      );

    res.redirect('/');
});

module.exports = router;
