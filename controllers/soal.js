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
exports.regSoal = async (req, res) => {

}

exports.editSoal = async (req, res) => {
    try{
        const { idsoal, soal, idaspek } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(idsoal && soal && idaspek ){
            Connection.query('SELECT id FROM t_aspek WHERE id = ?', [idaspek], async (error, resultsid) => {
                if(error){
                    // throw error;
                    res.status(500).json({
                        message: error
                    });
                } else if(resultsid.length == 0){
                    /** id acara tidak ada */
                    res.status(403).json({
                        message: "Aspek tidak terdaftar",
                    });                 
                } else if(resultsid.length > 0){
                    /** id ada */
                    Connection.query('UPDATE t_soal SET ? WHERE id = ?', [{soal: soal, date_updated: tanggal, time_updated: waktu}, idsoal], async (error, results) => {
                        if(error) { 
                            // throw error;
                            res.status(500).json({
                                message: error
                            });
                        } else {
                            /** Edit berhasil dilanjutkan ke acara */
                            res.status(201).json({
                                message: "Data soal berhasil di ubah",
                                idaspek
                            });
                        } 
                    })
                } else {
                    /** error */
                    res.status(403).json({
                        message: "Error, please contact developer",
                    });
                }
            });
        } else {
            /** Field tidak boleh kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
}

exports.deleteSoal = async (req, res) => {
    
}