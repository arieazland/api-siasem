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
    const { idacara, iduser, idsoal, radio } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(idacara && iduser && idsoal && radio){
        try{
            for( var i = 0; i < idsoal.length; i++){
                var simpan_jawaban = await new Promise((resolve, reject) => {
                    Connection.query("INSERT INTO t_answer SET ?", [{id: null, iduser: iduser, idsoal: idsoal[i], jawab: radio[i], idacara: idacara, date_created: tanggal, time_created: waktu}], (error, results)=>{
                        if(error) { 
                            reject(error);
                        } else {
                            resolve("true");
                        }
                    })
                })
            }

            if (simpan_jawaban === "true") {
                /** jika jawaban berhasil disimpan */
                res.status(201).json({
                    message: "Jawaban berhasil disimpan, silahkan melanjutkan",
                    idacara
                });
            } else {
                /** jika jawaban gagal disimpan */
                throw new Error('Jawaban gagal disimpan');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Field tidak boleh kosong */
        res.status(403).json({
            message: "Field tidak boleh kosong",
        });
    }
}

exports.registrasiJawabanV1 = async (req, res) => {
    
    const { idacara, iduser, idsoal, radio } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(idacara && iduser && idsoal && radio){
        try{
            var sql = "INSERT INTO t_answer (id, iduser, idsoal, jawab, idacara, date_created, time_created) VALUES ?";
            var value = [];
            for( var i = 0; i < idsoal.length; i++){
                value.push([null, iduser, idsoal[i], radio[i], idacara, tanggal, waktu]);
            }
        
            const simpan_jawaban = await new Promise((resolve, reject) => {
                Connection.query(sql, [value], (error, results) => {
                    if(error) { 
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            })

            if (simpan_jawaban) {
                res.status(201).json({
                    message: "Jawaban berhasil disimpan, silahkan melanjutkan",
                    idacara
                });
            } else {
                throw new Error('Jawaban gagal disimpan');
            }
        } catch(e) {
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Field tidak boleh kosong */
        res.status(403).json({
            message: "Field tidak boleh kosong",
        });
    }
}