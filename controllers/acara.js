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
exports.regAcara = async (req, res) => {
    try{
        const { namaacara, tanggalmulai, tanggalakhir, statusacara } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(namaacara && tanggalmulai && tanggalakhir && statusacara){
            if(statusacara === 'aktif' ||  statusacara === "nonaktif" ){
                Connection.query('INSERT INTO t_acara SET ?', {id: null, nama: namaacara, start: tanggalmulai, end: tanggalakhir, status: statusacara, date_created: tanggal, time_created: waktu}, async (error, results) => {
                    if(error) { 
                        // throw error;
                        res.status(500).json({
                            message: error
                        });
                    } else {
                        /** Insert berhasil dilanjutkan ke acara */
                        res.status(201).json({
                            message: "Data acara berhasil di simpan",
                        });
                    } 
                })
            } else {
                /** status acara bukan aktif/nonaktif */
                res.status(403).json({
                    message: "Status acara tidak tepat",
                });
            }
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

/** Edit Acara Process */
exports.editAcara = async (req, res) => {
    try{
        const { id, namaacara, tanggalmulai, tanggalakhir, statusacara } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(id && namaacara && tanggalmulai && tanggalakhir && statusacara){
            if(statusacara === 'aktif' ||  statusacara === "nonaktif" ){
                Connection.query('SELECT id FROM t_acara WHERE id = ?', [id], async (error, resultsid) => {
                    if(error){
                        // throw error;
                        res.status(500).json({
                            message: error
                        });
                    } else if(resultsid.length == 0){
                        /** id acara tidak ada */
                        res.status(403).json({
                            message: "Acara tidak terdaftar",
                        });                 
                    } else if(resultsid.length > 0){
                        /** id ada */
                        Connection.query('UPDATE t_acara SET ? WHERE id = ?', [{nama: namaacara, start: tanggalmulai, end: tanggalakhir, status: statusacara, date_updated: tanggal, time_updated: waktu}, id], async (error, results) => {
                            if(error) { 
                                // throw error;
                                res.status(500).json({
                                    message: error
                                });
                            } else {
                                /** Edit berhasil dilanjutkan ke acara */
                                res.status(201).json({
                                    message: "Data acara berhasil di ubah",
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
                /** status acara bukan aktif/nonaktif */
                res.status(403).json({
                    message: "Status acara tidak tepat",
                });
            }
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

/** Delete Acara Process */
exports.deleteAcara = async (req, res) => {
    try{
        const { id } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(id){
            Connection.query('SELECT id FROM t_acara WHERE id = ?', [id], async (error, resultsid) => {
                if(error){
                    // throw error;
                    res.status(500).json({
                        message: error
                    });
                } else if(resultsid.length == 0){
                    /** id acara tidak ada */
                    res.status(403).json({
                        message: "Acara tidak terdaftar",
                    });                 
                } else if(resultsid.length > 0){
                    /** id ada */
                    Connection.query('UPDATE t_acara SET ? WHERE id = ?', [{status: 'hapus', date_updated: tanggal, time_updated: waktu}, id], async (error, results) => {
                        if(error) { 
                            // throw error;
                            res.status(500).json({
                                message: error
                            });
                        } else {
                            /** Edit berhasil dilanjutkan ke acara */
                            res.status(201).json({
                                message: "Data acara berhasil di hapus",
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