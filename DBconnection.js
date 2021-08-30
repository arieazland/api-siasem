const Mysql = require('mysql');
const Dotenv = require("dotenv");
const { exec } = require("child_process");
Dotenv.config({ path: './.env' });

console.log(process.env.DB_HOST);
    console.log(process.env.DB_NAME);
    let connection = Mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

/** start of default code */
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Database connected!");
// });
//module.exports = connection;
/** end of defult code */

/** start of for server */
// exec("/Applications/XAMPP/xamppfiles/htdocs/api-siasem/DBconnection.js./npm start ls -la", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });
/** end of for server */

/** start of for local */
    connection.connect(function(err) {
        if (err) {
            console.log("ini error")
            
            // var minutes = 1, the_interval = minutes * 60 * 1000;
            // console.log("Running every 1 minutes");
            // setInterval(connection,the_interval);
            exec("pm2 restart api-sapa", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            exec("pm2 restart sapa", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });

        } 
        console.log("Database connected!");
});

module.exports = connection;
/** end of for local */
