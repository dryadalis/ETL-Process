var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
  const { title, name } = req.query;
  res.render('index', { title, name });
});

module.exports = router;
