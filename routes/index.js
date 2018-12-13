const express = require('express');
const router = express.Router();

const {Client} = require('pg');

const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

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
