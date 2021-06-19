const Express = require("express");
const Router = Express.Router();
const Dotenv = require("dotenv");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

/** Route for Register */
Router.get('/', (req, res) => {
    res.send("Hello, welcome to API-SIASEM Page")
})

/** Route for list user */
Router.get('/userlist', (req, res) =>{
    Connection.query("SELECT * FROM t_user WHERE NOT utipe = 'nonaktif' ORDER BY unama ASC", async (error, results) =>{
        if(error){ 
            res.status(500).json({
                message: 'Get data users error'
            })
        } else if(results.length >= 0){
            /** Kirim data user */
            res.status(200).json({
                data: results
            })
        }
    })
})

/** Route for list acara */
Router.get('/acaralist', (req, res) =>{
    Connection.query("SELECT * FROM t_acara WHERE NOT status = 'hapus' ORDER BY id ASC", async (error, results) =>{
        if(error){ 
            res.status(500).json({
                message: 'Get data acara error'
            })
        } else if(results.length >= 0){
            /** Kirim data user */
            res.status(200).json({
                data: results
            })
        }
    })
})

module.exports = Router;