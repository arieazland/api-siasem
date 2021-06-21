const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Insert Aspek Process */
exports.regAspek = async (req, res) => {
    try{
        const { idpart, nama, status } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(idpart && nama && status){
            Connection.query('SELECT * FROM t_part WHERE id = ?', [idpart], async (error, resultidpart) => {
                if(error) {
                    /** kirim error */
                    res.status(500).json({
                        message: error
                    });
                } else if(resultidpart.length == 0) {
                    /** Part tidak terdaftar */
                    res.status(403).json({
                        message: "Part tidak terdaftar"
                    });
                } else if(resultidpart[0].status == "hapus") {
                    /** Part sudah di hapus */
                    res.status(403).json({
                        message: "Part sudah di hapus"
                    });
                } else if(resultidpart.length > 0) {
                    if(status == 'aktif' || status == 'nonaktif'){
                        Connection.query('INSERT INTO t_aspek SET ?', {id:null, idpart: idpart, nama: nama, status: status, date_created: tanggal, time_created: waktu}, async (error, results) => {
                            if(error) {
                                /** kirim error */
                                res.status(403).json({
                                    message: error
                                });
                            } else {
                                res.status(201).json({
                                    message: "Aspek berhasil di daftarkan",
                                    idpart
                                });
                            }
                        })
                    } else {
                        /** Status aspek tidak tepat */
                        res.status(403).json({
                            message: "Status aspek tidak tepat"
                        });
                    }
                } else {
                    /** Send Error */
                    res.status(500).json({
                        message: "Error, please contact developer"
                    });
                }
            })
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

/** Edit Aspek Process */
exports.editAspek = async (req, res) => {
    try{
        const { idaspek, idpart, nama, status } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idaspek && idpart && nama && status){
            Connection.query('SELECT * FROM t_part WHERE id = ?', [idpart], async (error, resultidpart) => {
                if(error) {
                    /** Send error */
                    res.status(500).json({
                        message: error,
                    });
                } else if(resultidpart.length == 0) {
                    /** Part tidak terdaftar */
                    res.status(403).json({
                        message: "Part tidak terdaftar"
                    });
                } else if(resultidpart[0].status == "hapus") {
                    /** Part sudah di hapus */
                    res.status(403).json({
                        message: "Part sudah di hapus"
                    });
                } else if(resultidpart.length > 0) {
                    Connection.query('SELECT * FROM t_aspek WHERE idpart = ? AND id = ?', [idpart, idaspek], async (error, resultidaspek) => {
                        if(error) {
                            /** Send error */
                            res.status(500).json({
                                message: error,
                            });
                        } else if(resultidaspek.length == 0) {
                            /** Aspek tidak terdaftar */
                            res.status(403).json({
                                message: "Aspek tidak terdaftar"
                            });
                        } else if(resultidaspek[0].status == 'hapus') {
                            /** Aspek tidak terdaftar */
                            res.status(403).json({
                                message: "Aspek sudah di hapus"
                            });
                        } else if(resultidaspek.length > 0) {
                            Connection.query('UPDATE t_aspek SET ? WHERE id = ?', [{idpart: idpart, nama: nama, status: status, date_updated: tanggal, time_updated: waktu}, idaspek], async (error, result) => {
                                if(error) {
                                    /** Send error */
                                    res.status(500).json({
                                        message: error,
                                    });
                                } else {
                                    res.status(200).json({
                                        message: "Data aspek berhasil di ubah",
                                        idpart
                                    });
                                }
                            })
                        } else {
                            /** Send error */
                            res.status(500).json({
                                message: "Error, please contact developer"
                            });
                        }
                    })
                } else {
                    /** Send Error */
                    res.status(500).json({
                        message: "Error, please contact developer"
                    });
                }
            })
        } else {
            /** Field tidak boleh kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong",
            });
        }

    }catch(error) {
        /** Send error */
        res.status(500).json({
            message: error,
        });
    }
}

/** InseDeletert Aspek Process */
exports.deleteAspek = async (req, res) => {
    try{
        const { idaspek, idpart} = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idaspek && idpart){
            Connection.query('SELECT * FROM t_part WHERE id = ?', [idpart], async (error, resultidpart) => {
                    if(error) {
                        /** Send error */
                        res.status(500).json({
                            message: error,
                        });
                    } else if(resultidpart.length == 0) {
                        /** Part tidak terdaftar */
                        res.status(403).json({
                            message: "Part tidak terdaftar"
                        });
                    } else if(resultidpart[0].status == "hapus") {
                        /** Part sudah di hapus */
                        res.status(403).json({
                            message: "Part sudah di hapus"
                        });
                    } else if(resultidpart.length > 0) {
                        Connection.query('SELECT * FROM t_aspek WHERE idpart = ? AND id = ?', [idpart, idaspek], async (error, resultidaspek) => {
                            if(error) {
                                /** Send error */
                                res.status(500).json({
                                    message: error,
                                });
                            } else if(resultidaspek.length == 0) {
                                /** Aspek tidak terdaftar */
                                res.status(403).json({
                                    message: "Aspek tidak terdaftar"
                                });
                            } else if(resultidaspek[0].status == 'hapus') {
                                /** Aspek tidak terdaftar */
                                res.status(403).json({
                                    message: "Aspek sudah di hapus"
                                });
                            } else if(resultidaspek.length > 0) {
                                Connection.query("UPDATE t_aspek SET status = 'hapus' WHERE id = ?", [idaspek], async (error, results) => {
                                    if(error) {
                                        /** Send error */
                                        res.status(500).json({
                                            message: error,
                                        });
                                    } else {
                                        res.status(200).json({
                                            message: "Data aspek berhasil di hapus",
                                            idpart
                                        });
                                    }
                                })
                            } else {
                                /** Send error */
                                res.status(500).json({
                                    message: "Error, please contact developer"
                                });
                            }
                        })
                    } else {
                        /** Send Error */
                        res.status(500).json({
                            message: "Error, please contact developer"
                        });
                    }
            })
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