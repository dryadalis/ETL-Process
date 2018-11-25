const {Client} = require('pg');
const connectionString = 'postgres://qilciwcvmwwkeq:88b0ff2774f7302ceceeba40058199fa504e54addcefd32035ec051a4f8071da@ec2-54-246-84-200.eu-west-1.compute.amazonaws.com:5432/daf8aj45cvn96o?ssl=true'

const client = new Client({
    connectionString: connectionString,
});

client.connect();

client.query(
    'SELECT to_regclass("table_realestate")', (err, res) => {
      
        if(err.code === '42703') {
            client.query('DROP TABLE IF EXISTS Realestate');
            client.query('CREATE TABLE Realestate( ID SERIAL PRIMARY KEY, Title text, Price text)');
        }
    });
