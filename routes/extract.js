var express = require('express');
var router = express.Router();

var extraction = require('../services/extraction.js')

const {Client} = require('pg');
const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

router.get('/', function (req, res, next) {
  var extract = extraction.perform();

  extract
  .then(function(extraction_result) {

    client.query("DELETE FROM extractionresult");
    client.query(
      "INSERT INTO extractionresult (extraction) VALUES ($1) RETURNING id", ([extraction_result]), (err, res) => {
      // "SELECT COUNT(*) FROM extractionresult ", (err, res) => {

      // "SELECT table_name FROM information_schema.tables WHERE table_schema='public'", (err, res) => {
        // "SELECT * FROM extractionresult", (err, res) => {
          // select column_name,data_type
          // from information_schema.columns
          // where table_name = 'table_name';

        console.log(err);
        console.log(res.rows);
        }
    )

    // res.send(extraction_result);
    // id err == null idź daliiii
    res.redirect('/');
  });
});

module.exports = router;
