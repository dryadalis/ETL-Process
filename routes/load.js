var express = require('express');
var router = express.Router();

const {Client} = require('pg');


const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'
const queries = 'INSERT INTO Realestate(Title, Price) VALUES($1, $2)';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send(`<h1>NIE DZIAłA</h1>`)
});

module.exports = router;
