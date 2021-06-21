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
    try{
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
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for list acara */
Router.get('/acaralist', (req, res) =>{
    try{
        Connection.query("SELECT * FROM t_acara WHERE NOT status = 'hapus' ORDER BY id ASC", async (error, results) =>{
            if(error) { 
                /** kirim error */
                res.status(500).json({
                    message: error
                })
            } else if(results.length >= 0) {
                /** Kirim data user */
                res.status(200).json({
                    data: results
                })
            } else {
                /** kirim error */
                res.status(500).json({
                    message: error
                })
            }
        })
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for partisipan */
Router.post('/partisipant', (req, res) =>{
    try{
        const { selectacara } = req.body;

        if(selectacara){
            Connection.query('SELECT id FROM t_acara WHERE id = ?', [selectacara], async (error, resultsidacara) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(resultsidacara.length == 0) {
                    /** Kirim error */
                    res.status(403).json({
                        message: "Data acara tidak ada!"
                    })
                } else if(resultsidacara.length >0) {
                    Connection.query('SELECT p.id AS idpartisipan, a.id AS idacara, u.id AS iduser, u.unama AS namauser FROM t_partisipant p INNER JOIN t_acara a ON p.idacara = a.id INNER JOIN t_user u ON p.iduser = u.id WHERE a.id = ?', [selectacara], async (error, results) => {
                        if(error) {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(results.length >= 0) {
                            Connection.query("SELECT * FROM t_acara WHERE NOT status = 'hapus' ORDER BY nama ASC", async (error, acara) => {
                                if(error) {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else {
                                    Connection.query('SELECT id, nama FROM t_acara WHERE id = ?', [selectacara], async (error, pilihacara) => {
                                        if(error) {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else {
                                            Connection.query('SELECT u.id, u.unama FROM t_user u WHERE u.utipe = ? AND u.id NOT IN (SELECT p.iduser FROM t_partisipant p WHERE p.idacara = ?)', ['psikolog', selectacara], async (error, psikolog) => {
                                                if(error) {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    })
                                                } else {
                                                    /** Kirim data acara, psikolog dan partisipant */
                                                    res.status(200).json({
                                                        results: results,
                                                        acara : acara,
                                                        pilihacara: pilihacara,
                                                        psikolog : psikolog,
                                                        selectacara
                                                    })
                                                }
                                            });
                                        }
                                    })
                                }
                            });
                        } else {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        }
                    });
                } else {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                }
            });
        } else {
            /** Field kosong */
            res.status(500).json({
                message: 'Field tidak boleh kosong'
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
});

/** Route for part */
Router.get('/partlist', (req, res) =>{
    try{
        Connection.query("SELECT * FROM t_part WHERE NOT status = 'hapus' ORDER BY id ASC", async (error, results) => {
            if(error) {
                /** Kirim error */
                res.status(500).json({
                    message: error
                })
            } else if(results.length >= 0){
                /** Kirim data part */
                res.status(200).json({
                    data: results
                })
            } else {
                /** Kirim error */
                res.status(500).json({
                    message: error
                })
            }
        })

    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
});

/** Route for part */
Router.post('/aspeklist', (req, res) =>{
    try{
        const {selectpart} = req.body;

        if(selectpart){
            Connection.query("SELECT * FROM t_part p WHERE p.id = ?", [selectpart], async (error, resultsidpart) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(resultsidpart.length > 0) {
                    Connection.query("SELECT a.id AS idaspek, a.nama AS namaaspek, a.status AS statusaspek, p.id AS idpart, p.nama AS namapart, p.status AS statuspart FROM t_aspek a, t_part p WHERE a.idpart = p.id AND NOT a.status = 'hapus' AND NOT p.status = 'hapus' AND p.id = ? ORDER BY p.id ASC", [selectpart] ,async (error, results) => {
                        if(error) {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(results.length >= 0){
                            Connection.query("SELECT * FROM t_part", async (error, resultpart) => {
                                if(error){
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(resultpart.length >= 0) {
                                    /** Kirim data part */
                                    res.status(200).json({
                                        results,
                                        selectpart,
                                        resultsidpart,
                                        resultpart
                                    })
                                } else {
                                    /** Data part error */
                                    res.status(500).json({
                                        message: 'Error, contact developer'
                                    })
                                }
                            });
                        } else {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        }
                    })
                } else if(resultsidpart.length == 0) {
                    /** Filed kosong */
                    res.status(500).json({
                        message: 'Part tidak terdaftar'
                    })
                }
            });
        } else {
            /** Filed kosong */
            res.status(500).json({
                message: 'Field tidak boleh kosong'
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
});

module.exports = Router;