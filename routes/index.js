const express = require('express');
const router = express.Router();

const {Client} = require('pg');

const connectionString = 'postgres://ppbqhddekvzfau:d1a2238abc077848c9e922e7b14855b616b6be4e62ccf32baa65c2c67198776a@ec2-46-51-184-66.eu-west-1.compute.amazonaws.com:5432/dfem24oqv2gjut?ssl=true'

//Connect to postgresql
const client = new Client({
    connectionString: connectionString,
})

client.connect()

router.get('/', function (req, res) {
    client.query("SELECT title, price, description FROM realestate", (err, response) => {
        if (err) throw err;
        const titles = response.rows;
        const prices = response.rows;
        const descriptions = response.rows;
        const arr = [];

        for (let i = 0; i < titles.length; i++) {
            arr.push([titles[i].title, prices[i].price, descriptions[i].description]);
        }

        res.render('layout', {
            data: arr,
        })
    }).catch(function(error) {
        console.log(error);
      });
});

module.exports = router;
