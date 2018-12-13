const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'
const client = new Client({
    connectionString: connectionString,
});

client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
});

router.get('/', async function (req, res) {
    await client.query("TRUNCATE realestate");
    res.redirect('/#cleared');
});

module.exports = router;

