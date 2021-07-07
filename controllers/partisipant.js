const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Insert partisipan Process */
exports.regPartisipant = async (req, res) => {
    try{
        const { iduser, idacara } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(iduser && idacara){
            /** cek data user */
            var sqluser = "SELECT id FROM t_user WHERE id IN (?)";
            var valueuser = [];
            for( var i = 0; i < iduser.length; i++){
                valueuser.push([iduser[i]]);
            }
            Connection.query(sqluser, [valueuser], async (error, resultsiduser) => {
                if(error) {
                    /** Send error */
                    res.status(500).json({
                        message: "Error resultsiduser",
                    });
                } else if(resultsiduser.length == 0) {
                    /** User tidak terdaftar */
                    res.status(403).json({
                        message: "User tidak terdaftar dalam data user",
                    });
                } else if(resultsiduser.length > 0) {
                    /** cek data acara */
                    Connection.query('SELECT id FROM t_acara WHERE id = ?', idacara, async (error, resultsidacara) => {
                        if(error) {
                            /** Send error */
                            res.status(500).json({
                                message: "Error resultidacara",
                            });
                        } else if(resultsidacara.length == 0) {
                            /** Acara tidak terdaftar */
                            res.status(403).json({
                                message: "Acara tidak terdaftar dalam data acara",
                            });
                        } else if (resultsidacara.length > 0) {
                            /** Cek iduser apakah sudah terdaftar di partisipant */
                            var sqlpartisipant = "SELECT iduser FROM t_partisipant WHERE idacara = ? AND iduser IN (?)";
                            var valuepartisipant = [];
                            for( var j = 0; j < iduser.length; j++){
                                valuepartisipant.push([iduser[j]]);
                            }
                            var cek = Connection.query(sqlpartisipant, [idacara, valuepartisipant], async (error, resultscekuser) => {
                            if(error) {
                                /** Send error */
                                res.status(500).json({
                                    message: "Error resultcekuser",
                                });
                            } else if(resultscekuser.length == 0) {
                                /** Proses insert data user dan acara ke partisipant */
                                
                                var sqlinsert = "INSERT INTO t_partisipant (id, iduser, idacara, date_created, time_created) VALUES ?";
                                var valueinsert = [];
                                for( var k = 0; k < iduser.length; k++){
                                    valueinsert.push([null, iduser[k], idacara, tanggal, waktu]);
                                }
                                Connection.query(sqlinsert, [valueinsert], async (error, result) => {
                                    if(error) {
                                        /** Send error */
                                        res.status(500).json({
                                            message: "Error insert partisipan",
                                        });
                                    } else {
                                        res.status(201).json({
                                            message: "User berhasil di daftarkan",
                                            idacara
                                        });
                                    }
                                });
                            } else if(resultscekuser.length > 0) {
                                /** Acara tidak terdaftar */
                                res.status(403).json({
                                    message: "User sudah terdaftar dalam data partisipan",
                                    idacara
                                });
                            }
                            })
                            console.log(cek)
                        } else {
                            /** Send error */
                            res.status(500).json({
                                message: "Error, please contact developer!",
                            });
                        }
                    })
                } else {
                    /** Send error */
                    res.status(500).json({
                        message: "Error, please contact developer!",
                    });
                }
            });
        } else {
            /** Field tidak boleh kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong",
                idacara
            });
        }

    } catch(error) {
        /** Send error */
        res.status(500).json({
            message: "Error cartch",
        });
    }
}

/** Delete partisipan Process */
exports.deletePartisipant = async (req, res) => {
    try{
        const { idpartisipant, iduser, idacara } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idpartisipant && iduser && idacara){
            /** Cek data partisipant */
            Connection.query('SELECT id, iduser, idacara from t_partisipant WHERE id = ? AND iduser = ? AND idacara = ?', [idpartisipant, iduser, idacara], async (error, resultsidpartisipant) => {
                if(error) {
                    /** Send error */
                    res.status(500).json({
                        message: error,
                    });
                } else if (resultsidpartisipant.length == 0) {
                    /** Partisipant tidak terdaftar */
                    res.status(403).json({
                        message: "Data partisipant tidak terdaftar",
                        idacara
                    });
                } else if(resultsidpartisipant.length > 0) {
                    /** cek data user */
                    Connection.query('SELECT id FROM t_user WHERE id = ?', [iduser], async (error, resultsiduser) => {
                        if(error) {
                            /** Send error */
                            res.status(500).json({
                                message: error,
                            });
                        } else if(resultsiduser.length == 0) {
                            /** User tidak terdaftar */
                            res.status(403).json({
                                message: "User tidak terdaftar dalam data user",
                            });
                        } else if(resultsiduser.length > 0) {
                            /** cek data acara */
                            Connection.query('SELECT id FROM t_acara WHERE id = ?', [idacara], async (error, resultsidacara) => {
                                if(error) {
                                    /** Send error */
                                    res.status(500).json({
                                        message: error,
                                    });
                                } else if(resultsidacara.length == 0) {
                                    /** Acara tidak terdaftar */
                                    res.status(403).json({
                                        message: "Acara tidak terdaftar dalam data acara",
                                    });
                                } else if (resultsidacara.length > 0) {
                                    /** Cek iduser apakah terdaftar di partisipant */
                                    Connection.query('SELECT iduser FROM t_partisipant WHERE idacara = ? AND iduser = ?', [idacara, iduser], async (error, resultscekuser) => {
                                        if(error) {
                                            /** Send error */
                                            res.status(500).json({
                                                message: error,
                                            });
                                        } else if(resultscekuser.length == 0) {
                                            /** User tidak terdaftar */
                                            res.status(403).json({
                                                message: "User tidak terdaftar dalam data partisipan",
                                                idacara
                                            });
                                        } else if(resultscekuser.length > 0) {
                                            /** Proses delete data user dan acara dari partisipant */
                                            Connection.query('DELETE FROM t_partisipant WHERE id = ?', [idpartisipant], async (error, result) => {
                                                if(error) {
                                                    /** Send error */
                                                    res.status(500).json({
                                                        message: error,
                                                    });
                                                } else {
                                                    res.status(201).json({
                                                        message: "User berhasil di hapus dari partisipant",
                                                        idacara
                                                    });
                                                }
                                            });
                                        }
                                    })
                                } else {
                                    /** Send error */
                                    res.status(500).json({
                                        message: "Error, please contact developer!",
                                    });
                                }
                            });
                        } else {
                            /** Send error */
                            res.status(500).json({
                                message: "Error, please contact developer!",
                            });
                        }
                    });
                } else {
                    /** Send error */
                    res.status(500).json({
                        message: 'Error, please contact developer',
                        idacara
                    });
                }
            });
        } else {
            /** Field tidak boleh kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong",
            });
        }
    } catch(error) {
        /** Send error */
        res.status(500).json({
            message: error,
        });
    }
}
    