var express = require('express');
var router = express.Router();

var loading = require('../services/loading.js');

const {Client} = require('pg');

const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

router.post('/', function (req, res, next) {
  client.query(
    "SELECT transformation FROM transformationresult LIMIT 1", (err, res) => {
      console.log(err);
      return res;
    }
  )
  .then(function(res) {

      const transformation_result = JSON.parse(res.rows[0].transformation);
      console.log('form database');
      console.log(res.rows[0].transformation);

      const titles = transformation_result[0];
      const prices = transformation_result[1];

      console.log('ready to load');
      console.log(transformation_result);

      loading.perform(titles, prices, client);

      return res;
      }
    )
    client.query("DELETE FROM transformationresult");
    // res.redirect('/');
    res.json({status: 'ready'});
});

module.exports = router;
