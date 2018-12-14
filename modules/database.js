const {Client} = require('pg');
const connectionString = 'postgres://ppbqhddekvzfau:d1a2238abc077848c9e922e7b14855b616b6be4e62ccf32baa65c2c67198776a@ec2-46-51-184-66.eu-west-1.compute.amazonaws.com:5432/dfem24oqv2gjut?ssl=true'

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

client.query(
    'SELECT to_regclass("table_realestate")', (err) => {
            if(err.code === '42703') {
                client.query('DROP TABLE IF EXISTS Realestate');
                client.query('CREATE TABLE Realestate( ID SERIAL PRIMARY KEY, Title text CONSTRAINT must_be_different UNIQUE, Price text, DataOfAddition text)');
        }
        process.exit(0)
    });
