const { Client } = require('pg');

const client = new Client({
    host: '167.99.28.252',
    user: 'myuser',
    password: 'mypassword',
    database: 'myappdb',
    port: 5432,
});

client.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected');
    }
});

client.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = client;
