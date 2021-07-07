const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Insert Acara Process */
exports.registrasiJawaban = async (req, res) => {
    try{
        const { idacara, iduser, idsoal, radio } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(idacara && iduser && idsoal && radio){
            // var sql = "INSERT INTO t_answer (id, iduser, idsoal, jawab, idacara, date_created, time_created) VALUES ?";
            // var value = [];
            for( var i = 0; i < idsoal.length; i++){
                // value.push([null, iduser, idsoal[i], radio[i], idacara, tanggal, waktu]);
                var inputjawaban = Connection.query("INSERT INTO t_answer SET ?", [{id: null, iduser: iduser, idsoal: idsoal[i], jawab: radio[i], idacara: idacara, date_created: tanggal, time_created: waktu}], async(error, results)=>{})
            }
            if(inputjawaban){
                /** input jawaban berhasil */
                res.status(201).json({
                    message: "Jawaban berhasil disimpan, silahkan melanjutkan",
                        idacara
                });
            } else {
                res.status(500).json({
                    message: "Jawaban gagal disimpan"
                });
            }
            // Connection.query(sql, [value], async (error, results) => {
            //     if(error){
            //         res.status(500).json({
            //             message: error
            //         });
            //     } else {
            //         /** Field tidak boleh kosong */
            //         res.status(201).json({
            //             message: "Jawaban berhasil disimpan, silahkan melanjutkan",
            //              idacara
            //         });
            //     }
            // })
        } else {
            /** Field tidak boleh kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong",
            });
        }
    } catch(error) {
        res.status(500).json({
            message: error
        });
    }
}