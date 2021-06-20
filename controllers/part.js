const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** insert part process */
exports.regPart = async (req, res, dataputs) => {
    try{
        const { namapart, statuspart } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(namapart && statuspart){
            if(statuspart === 'aktif' ||  statuspart === "nonaktif" ){
                Connection.query('INSERT INTO t_part SET ?', {id: null, nama: namapart, status: statuspart, date_created: tanggal, time_created: waktu}, async (error, results) => {
                    if(error) { 
                        // throw error;
                        res.status(500).json({
                            message: error
                        });
                    } else {
                        /** Insert berhasil dilanjutkan ke part */
                        res.status(201).json({
                            message: "Data part berhasil di simpan",
                        });
                    } 
                })
            } else {
                /** status part bukan aktif/nonaktif */
                res.status(403).json({
                    message: "Status part tidak tepat",
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

/** edit part process */
exports.editPart = async (req, res, dataputs) => {
    try{
        const { id, namapart, statuspart } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(id && namapart && statuspart){
            if(statuspart === 'aktif' ||  statuspart === "nonaktif" ){
                Connection.query('SELECT id FROM t_part WHERE id = ?', [id], async (error, resultsid) => {
                    if(error){
                        // throw error;
                        res.status(500).json({
                            message: error
                        });
                    } else if(resultsid.length == 0){
                        /** id part tidak ada */
                        res.status(403).json({
                            message: "Part tidak terdaftar",
                        });                 
                    } else if(resultsid.length > 0){
                        /** id ada */
                        Connection.query('UPDATE t_part SET ? WHERE id = ?', [{nama: namapart, status: statuspart, date_updated: tanggal, time_updated: waktu}, id], async (error, results) => {
                            if(error) { 
                                // throw error;
                                res.status(500).json({
                                    message: error
                                });
                            } else {
                                /** Edit berhasil dilanjutkan ke part */
                                res.status(201).json({
                                    message: "Data part berhasil di ubah",
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
                /** status part bukan aktif/nonaktif */
                res.status(403).json({
                    message: "Status part tidak tepat",
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

/** delete part process */
exports.deletePart = async (req, res, dataputs) => {
    try{
        const { id } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(id){
            Connection.query('SELECT id FROM t_part WHERE id = ?', [id], async (error, resultsid) => {
                if(error){
                    // throw error;
                    res.status(500).json({
                        message: error
                    });
                } else if(resultsid.length == 0){
                    /** id part tidak ada */
                    res.status(403).json({
                        message: "Part tidak terdaftar",
                    });                 
                } else if(resultsid.length > 0){
                    /** id ada */
                    Connection.query('UPDATE t_part SET ? WHERE id = ?', [{status: 'hapus', date_updated: tanggal, time_updated: waktu}, id], async (error, results) => {
                        if(error) { 
                            // throw error;
                            res.status(500).json({
                                message: error
                            });
                        } else {
                            /** Edit berhasil dilanjutkan ke part */
                            res.status(201).json({
                                message: "Data part berhasil di hapus",
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