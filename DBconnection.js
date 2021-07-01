const Mysql = require('mysql');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });

console.log(process.env.DB_HOST);
console.log(process.env.DB_NAME);
let connection = Mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});

module.exports = connection;
