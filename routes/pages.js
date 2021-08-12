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

/** Route for list acara */
Router.get('/acaralistmahasiswa', (req, res) =>{
    try{
        var tanggal = Moment().format("YYYY-MM-DD");

        Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) =>{
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
                                message: "Error, please contact developer"
                            })
                        }
                    });
                } else {
                    /** Kirim error */
                    res.status(500).json({
                        message: "Error, please contact developer"
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

/** Route for aspek */
Router.post('/listaspek', (req, res) =>{
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

/** Route for aspek all */
Router.get('/listaspekall', (req, res) =>{
    try{
        Connection.query("SELECT a.id AS idaspek, a.nama AS namaaspek, a.status AS statusaspek, p.id AS idpart, p.nama AS namapart, p.status AS statuspart FROM t_aspek a, t_part p WHERE a.idpart = p.id AND NOT a.status = 'hapus' AND NOT p.status = 'hapus' ORDER BY a.nama ASC",async (error, data) => {
            if(error) {
                /** Kirim error */
                res.status(500).json({
                    message: error
                })
            } else if(data.length >= 0){
                /** Kirim data part */
                res.status(200).json({
                    data
                })
            } else {
                /** Kirim error */
                res.status(500).json({
                    message: error
                })
            }
        });
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
});

/** Route for soal */
Router.post('/listsoal', (req, res) =>{
    try{
        const {selectaspek} = req.body;

        if(selectaspek){
            Connection.query("SELECT * FROM t_aspek a WHERE a.id = ?", [selectaspek], async (error, resultsidaspek) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(resultsidaspek.length > 0) {
                    Connection.query("SELECT s.id AS idsoal, s.soal AS soal, s.status AS statussoal, a.id AS idaspek, a.nama AS namaaspek, a.status AS statusaspek, p.id AS idpart, p.nama AS namapart, p.status AS statuspart FROM t_soal s, t_aspek a, t_part p WHERE s.idaspek = a.id AND s.idpart = p.id AND s.idaspek = ?", [selectaspek] ,async (error, results) => {
                        if(error) {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(results.length >= 0){
                            Connection.query("SELECT a.id AS idaspek, a.nama AS namaaspek, a.status AS statusaspek, p.id AS idpart, p.nama AS namapart, p.status AS statuspart FROM t_aspek a, t_part p WHERE a.idpart = p.id AND NOT a.status = 'hapus' AND NOT p.status = 'hapus' ORDER BY a.nama ASC ", async (error, resultaspek) => {
                                if(error){
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(resultaspek.length >= 0) {
                                    /** Kirim data part */
                                    res.status(200).json({
                                        results,
                                        selectaspek,
                                        resultsidaspek,
                                        resultaspek
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
                } else if(resultsidaspek.length == 0) {
                    /** Filed kosong */
                    res.status(500).json({
                        message: 'Aspek tidak terdaftar'
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

/** Route for pertanyaan */
// Router.post('/listpertanyaan', (req, res) =>{
//     try{
//         const { selectacara, idu } = req.body;

//         if(selectacara && idu){
//             /** Cek apakah user sudah ada jawaban di part 1 */
//             Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 1 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban1) => {
//                 if(error){
//                     /** Kirim error */
//                     res.status(500).json({
//                         message: error
//                     })
//                 } else if(cekjawaban1.length > 0){
//                     /** jika sudah ada jawaban part 1, cek jawaban di part 2 */
//                     Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 2 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban2) => {
//                         if(error){
//                             /** Kirim error */
//                             res.status(500).json({
//                                 message: error
//                             })
//                         } else if(cekjawaban2.length > 0){
//                             /** jika sudah ada jawaban part 2, cek jawaban di part 3 */
//                             Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 3 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban3) => {
//                                 if(error){
//                                     /** Kirim error */
//                                     res.status(500).json({
//                                         message: error
//                                     })
//                                 } else if (cekjawaban3.length > 0){
//                                     /** jika sudah ada jawaban part 3, cek jawaban di part 4 */
//                                     Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 4 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban4) => {
//                                         if(error){
//                                             /** Kirim error */
//                                             res.status(500).json({
//                                                 message: error
//                                             })
//                                         } else if(cekjawaban4.length > 0){
//                                             /** jika sudah ada jawaban part 4, cek jawaban di part 5 */
//                                             Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 5 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban5) => {
//                                                 if(error){
//                                                     /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: error
//                                                     })
//                                                 } else if(cekjawaban5.length > 0){
//                                                     /** jika sudah ada jawaban part 5, kirim notif assessment selesai */
//                                                     /** cek ketersediaan acara */
//                                                     Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
//                                                         if(error){
//                                                            /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: error
//                                                             }) 
//                                                         } else if(resultsidacara.length > 0) {
//                                                             Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
//                                                                 if(error) {
//                                                                     /** Kirim error */
//                                                                     res.status(500).json({
//                                                                         message: error
//                                                                     }) 
//                                                                 } else if(dataacara.length >= 0) {
//                                                                     res.status(200).json({
//                                                                         selectacara,
//                                                                         dataacara,
//                                                                         message: 'Assessment selesai, silahkan logout. Terima kasih'
//                                                                     })
//                                                                 } else {
//                                                                     /** Kirim error */
//                                                                     res.status(500).json({
//                                                                         message: 'Error, please contact developer'
//                                                                     }) 
//                                                                 }
//                                                             })
//                                                         } else if(resultsidacara.length == 0) {
//                                                             res.status(500).json({
//                                                                 message: 'Acara tidak terdaftar'
//                                                             }) 
//                                                         } else {
//                                                             /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: error
//                                                             }) 
//                                                         }
//                                                     })
//                                                 } else if(cekjawaban5.length == 0){
//                                                     /** jika belum ada jawaban di part 5 tampilkan pertanyaan part 5 */
//                                                     Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 5 ORDER BY t_soal.id ASC', async (error, results) => {
//                                                         if(error){
//                                                             /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: error
//                                                             })
//                                                         } else if(results.length >= 0){
//                                                             /** cek ketersediaan acara */
//                                                             Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
//                                                                 if(error){
//                                                                    /** Kirim error */
//                                                                     res.status(500).json({
//                                                                         message: error
//                                                                     }) 
//                                                                 } else if(resultsidacara.length > 0) {
//                                                                     Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
//                                                                         if(error) {
//                                                                             /** Kirim error */
//                                                                             res.status(500).json({
//                                                                                 message: error
//                                                                             }) 
//                                                                         } else if(dataacara.length >= 0) {
//                                                                             res.status(200).json({
//                                                                                 results,
//                                                                                 selectacara,
//                                                                                 dataacara,
//                                                                                 partpertanyaan : 5
//                                                                             })
//                                                                         } else {
//                                                                             /** Kirim error */
//                                                                             res.status(500).json({
//                                                                                 message: 'Error, please contact developer'
//                                                                             }) 
//                                                                         }
//                                                                     })
//                                                                 } else if(resultsidacara.length == 0) {
//                                                                     res.status(500).json({
//                                                                         message: 'Acara tidak terdaftar'
//                                                                     }) 
//                                                                 } else {
//                                                                     /** Kirim error */
//                                                                     res.status(500).json({
//                                                                         message: error
//                                                                     }) 
//                                                                 }
//                                                             })
//                                                         } else {
//                                                             /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: 'Error, please contact developer'
//                                                             }) 
//                                                         }
//                                                     })
//                                                 } else {
//                                                     /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: 'Error, please contact developer'
//                                                     }) 
//                                                 }
//                                             })
//                                         } else if(cekjawaban4.length == 0){
//                                             /** jika belum ada jawaban di part 4 tampilkan pertanyaan part 4 */
//                                             Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 4 ORDER BY t_soal.id ASC', async (error, results) => {
//                                                 if(error){
//                                                     /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: error
//                                                     })
//                                                 } else if(results.length >= 0){
//                                                     /** cek ketersediaan acara */
//                                                     Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
//                                                         if(error){
//                                                            /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: error
//                                                             }) 
//                                                         } else if(resultsidacara.length > 0) {
//                                                             Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
//                                                                 if(error) {
//                                                                     /** Kirim error */
//                                                                     res.status(500).json({
//                                                                         message: error
//                                                                     }) 
//                                                                 } else if(dataacara.length >= 0) {
//                                                                     res.status(200).json({
//                                                                         results,
//                                                                         selectacara,
//                                                                         dataacara,
//                                                                         partpertanyaan : 4
//                                                                     })
//                                                                 } else {
//                                                                     /** Kirim error */
//                                                                     res.status(500).json({
//                                                                         message: 'Error, please contact developer'
//                                                                     }) 
//                                                                 }
//                                                             })
//                                                         } else if(resultsidacara.length == 0) {
//                                                             res.status(500).json({
//                                                                 message: 'Acara tidak terdaftar'
//                                                             }) 
//                                                         } else {
//                                                             /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: error
//                                                             }) 
//                                                         }
//                                                     })
//                                                 } else {
//                                                     /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: 'Error, please contact developer'
//                                                     }) 
//                                                 }
//                                             })
//                                         } else {
//                                             /** Kirim error */
//                                             res.status(500).json({
//                                                 message: 'Error, please contact developer'
//                                             }) 
//                                         }
//                                     })
//                                 } else if(cekjawaban3.length == 0){
//                                     /** jika belum ada jawaban di part 3 tampilkan pertanyaan part 3 */
//                                     Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 3 ORDER BY t_soal.id ASC', async (error, results) => {
//                                         if(error){
//                                             /** Kirim error */
//                                             res.status(500).json({
//                                                 message: error
//                                             })
//                                         } else if(results.length >= 0){
//                                             /** cek ketersediaan acara */
//                                             Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
//                                                 if(error){
//                                                    /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: error
//                                                     }) 
//                                                 } else if(resultsidacara.length > 0) {
//                                                     Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
//                                                         if(error) {
//                                                             /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: error
//                                                             }) 
//                                                         } else if(dataacara.length >= 0) {
//                                                             res.status(200).json({
//                                                                 results,
//                                                                 selectacara,
//                                                                 dataacara,
//                                                                 partpertanyaan : 3
//                                                             })
//                                                         } else {
//                                                             /** Kirim error */
//                                                             res.status(500).json({
//                                                                 message: 'Error, please contact developer'
//                                                             }) 
//                                                         }
//                                                     })
//                                                 } else if(resultsidacara.length == 0) {
//                                                     res.status(500).json({
//                                                         message: 'Acara tidak terdaftar'
//                                                     }) 
//                                                 } else {
//                                                     /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: error
//                                                     }) 
//                                                 }
//                                             })
//                                         } else {
//                                             /** Kirim error */
//                                             res.status(500).json({
//                                                 message: 'Error, please contact developer'
//                                             }) 
//                                         }
//                                     })
//                                 } else {
//                                     /** Kirim error */
//                                     res.status(500).json({
//                                         message: 'Error, please contact developer'
//                                     }) 
//                                 }
//                             })
//                         } else if(cekjawaban2.length == 0) {
//                             /** jika belum ada jawaban di part 2 tampilkan pertanyaan part 2 */
//                             Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 2 ORDER BY t_soal.id ASC', async (error, results) => {
//                                 if(error){
//                                     /** Kirim error */
//                                     res.status(500).json({
//                                         message: error
//                                     })
//                                 } else if(results.length >= 0){
//                                     /** cek ketersediaan acara */
//                                     Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
//                                         if(error){
//                                            /** Kirim error */
//                                             res.status(500).json({
//                                                 message: error
//                                             }) 
//                                         } else if(resultsidacara.length > 0) {
//                                             Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
//                                                 if(error) {
//                                                     /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: error
//                                                     }) 
//                                                 } else if(dataacara.length >= 0) {
//                                                     res.status(200).json({
//                                                         results,
//                                                         selectacara,
//                                                         dataacara,
//                                                         partpertanyaan : 2
//                                                     })
//                                                 } else {
//                                                     /** Kirim error */
//                                                     res.status(500).json({
//                                                         message: 'Error, please contact developer'
//                                                     }) 
//                                                 }
//                                             })
//                                         } else if(resultsidacara.length == 0) {
//                                             res.status(500).json({
//                                                 message: 'Acara tidak terdaftar'
//                                             }) 
//                                         } else {
//                                             /** Kirim error */
//                                             res.status(500).json({
//                                                 message: error
//                                             }) 
//                                         }
//                                     })
//                                 } else {
//                                     /** Kirim error */
//                                     res.status(500).json({
//                                         message: 'Error, please contact developer'
//                                     }) 
//                                 }
//                             })
//                         } else {
//                             /** Kirim error */
//                             res.status(500).json({
//                                 message: 'Error, please contact developer'
//                             }) 
//                         }
//                     })
//                 } else if(cekjawaban1.length == 0) {
//                     /** jika belum ada jawaban di part 1 tampilkan pertanyaan part 1 */
//                     Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 1 ORDER BY t_soal.id ASC', async (error, results) => {
//                         if(error){
//                             /** Kirim error */
//                             res.status(500).json({
//                                 message: error
//                             })
//                         } else if(results.length >= 0){
//                             /** cek ketersediaan acara */
//                             Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
//                                 if(error){
//                                    /** Kirim error */
//                                     res.status(500).json({
//                                         message: error
//                                     }) 
//                                 } else if(resultsidacara.length > 0) {
//                                     Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
//                                         if(error) {
//                                             /** Kirim error */
//                                             res.status(500).json({
//                                                 message: error
//                                             }) 
//                                         } else if(dataacara.length >= 0) {
//                                             res.status(200).json({
//                                                 results,
//                                                 selectacara,
//                                                 dataacara,
//                                                 partpertanyaan : 1
//                                             })
//                                         } else {
//                                             /** Kirim error */
//                                             res.status(500).json({
//                                                 message: 'Error, please contact developer'
//                                             }) 
//                                         }
//                                     })
//                                 } else if(resultsidacara.length == 0) {
//                                     res.status(500).json({
//                                         message: 'Acara tidak terdaftar'
//                                     }) 
//                                 } else {
//                                     /** Kirim error */
//                                     res.status(500).json({
//                                         message: error
//                                     }) 
//                                 }
//                             })
//                         } else {
//                             /** Kirim error */
//                             res.status(500).json({
//                                 message: 'Error, please contact developer'
//                             }) 
//                         }
//                     })
//                 } else {
//                     /** Kirim error */
//                     res.status(403).json({
//                         message: "Error, please contact developer"
//                     })
//                 }
//             })
//         } else {
//             /** Kirim error */
//             res.status(500).json({
//                 message: "Field tidak boleh kosong"
//             })
//         }
//     } catch(error) {
//         /** Kirim error */
//         res.status(500).json({
//             message: error
//         })
//     }
// });

Router.post('/listpertanyaan2', async (req, res) =>{
    const { selectacara, idu } = req.body;
    if(selectacara, idu){
        try{
            /** cek apakah user sudah ada jawaban di part 1 */
            const cek_part1 = await new Promise((resolve, reject) => {
                Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 1 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] , (error, cek_jawaban1) => {
                    if(error) { 
                        /** jika error */
                        reject(error);
                    } else {
                        /** jika results */
                        resolve(cek_jawaban1);
                    }
                });
            });

            if(cek_part1.length === 0){
                /** jika tidak ada jawaban di part 1, tampil pertanyaan part 1 */
                const pertanyaan_part1 = await new Promise((resolve, reject) => {
                    Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 1 ORDER BY t_soal.id ASC', async (error, resultspart1) => {
                        if(error) { 
                            /** jika error */
                            reject(error);
                        } else {
                            /** jika results */
                            resolve(resultspart1);
                        }
                    })
                })

                if(pertanyaan_part1.length >= 0){
                    /** jika tidak error, get data acara */
                    const dataacara = await new Promise((resolve, reject) => {
                        Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(results);
                            }
                        })
                    })
                    if(dataacara.length >= 0){
                        /** kirim data */
                        res.status(201).json({ pertanyaan_part1, selectacara, dataacara, partpertanyaan : "1" });
                    } else {
                        /** jika error lainnya */
                        throw new Error('Error, please contact developer');
                    }
                } else {
                    /** jika error lainnya */
                    throw new Error('Error, please contact developer');
                }
            } else if(cek_part1.length > 0){
                /** jika user sudah menjawab part 1 pada acara terpilih, cek jawaban di part 2 */
                const cek_part2 = await new Promise((resolve, reject) => {
                    Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 2 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] , (error, cek_jawaban2) => {
                        if(error) { 
                            /** jika error */
                            reject(error);
                        } else {
                            /** jika results */
                            resolve(cek_jawaban2);
                        }
                    });
                });
                
                if(cek_part2.length === 0){
                    /** jika tidak ada jawaban di part 2, tampil pertanyaan part 2 */
                    const pertanyaan_part2 = await new Promise((resolve, reject) => {
                        Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 2 ORDER BY t_soal.id ASC', async (error, resultspart2) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(resultspart2);
                            }
                        })
                    })
    
                    if(pertanyaan_part2.length >= 0){
                        /** jika tidak error, get data acara */
                        const dataacara = await new Promise((resolve, reject) => {
                            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(results);
                                }
                            })
                        })
                        if(dataacara.length >= 0){
                            /** kirim data */
                            res.status(201).json({ pertanyaan_part2, selectacara, dataacara, partpertanyaan : "2" });
                        } else {
                            /** jika error lainnya */
                            throw new Error('Error, please contact developer');
                        }
                    } else {
                        /** jika error lainnya */
                        throw new Error('Error, please contact developer');
                    }
                } else if(cek_part2.length > 0){
                    /** jika user sudah menjawab part 2 pada acara terpilih, cek jawaban di part 3 */
                    const cek_part3 = await new Promise((resolve, reject) => {
                        Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 3 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] , (error, cek_jawaban3) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(cek_jawaban3);
                            }
                        });
                    });
                    
                    if(cek_part3.length === 0){
                        /** jika tidak ada jawaban di part 3, tampil pertanyaan part 3 */
                        const pertanyaan_part3 = await new Promise((resolve, reject) => {
                            Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 3 ORDER BY t_soal.id ASC', async (error, resultspart3) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(resultspart3);
                                }
                            })
                        })
        
                        if(pertanyaan_part3.length >= 0){
                            /** jika tidak error, get data acara */
                            const dataacara = await new Promise((resolve, reject) => {
                                Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                    if(error) { 
                                        /** jika error */
                                        reject(error);
                                    } else {
                                        /** jika results */
                                        resolve(results);
                                    }
                                })
                            })
                            if(dataacara.length >= 0){
                                /** kirim data */
                                res.status(201).json({ pertanyaan_part3, selectacara, dataacara, partpertanyaan : "3" });
                            } else {
                                /** jika error lainnya */
                                throw new Error('Error, please contact developer');
                            }
                        } else {
                            /** jika error lainnya */
                            throw new Error('Error, please contact developer');
                        }
                    } else if(cek_part3.length > 0){
                        /** jika user sudah menjawab part 3 pada acara terpilih, cek jawaban di part 4 */
                        const cek_part4 = await new Promise((resolve, reject) => {
                            Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 4 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] , (error, cek_jawaban4) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(cek_jawaban4);
                                }
                            });
                        });

                        if(cek_part4.length === 0) {
                            /** jika tidak ada jawaban di part 4, tampil pertanyaan part 4 */
                            const pertanyaan_part4 = await new Promise((resolve, reject) => {
                                Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 4 ORDER BY t_soal.id ASC', async (error, resultspart4) => {
                                    if(error) { 
                                        /** jika error */
                                        reject(error);
                                    } else {
                                        /** jika results */
                                        resolve(resultspart4);
                                    }
                                })
                            })
            
                            if(pertanyaan_part4.length >= 0){
                                /** jika tidak error, get data acara */
                                const dataacara = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                        if(error) { 
                                            /** jika error */
                                            reject(error);
                                        } else {
                                            /** jika results */
                                            resolve(results);
                                        }
                                    })
                                })
                                if(dataacara.length >= 0){
                                    /** kirim data */
                                    res.status(201).json({ pertanyaan_part4, selectacara, dataacara, partpertanyaan : "4" });
                                } else {
                                    /** jika error lainnya */
                                    throw new Error('Error, please contact developer');
                                }
                            } else {
                                /** jika error lainnya */
                                throw new Error('Error, please contact developer');
                            }
                        } else if(cek_part4.length > 0) {
                            /** jika user sudah menjawab part 4 pada acara terpilih, cek jawaban di part 5 */
                            const cek_part5 = await new Promise((resolve, reject) => {
                                Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 5 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] , (error, cek_jawaban5) => {
                                    if(error) { 
                                        /** jika error */
                                        reject(error);
                                    } else {
                                        /** jika results */
                                        resolve(cek_jawaban5);
                                    }
                                });
                            });

                            if(cek_part5.length === 0) {
                                /** jika tidak ada jawaban di part 5, tampil pertanyaan part 5 */
                                const pertanyaan_part5 = await new Promise((resolve, reject) => {
                                    Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 5 ORDER BY t_soal.id ASC', async (error, resultspart5) => {
                                        if(error) { 
                                            /** jika error */
                                            reject(error);
                                        } else {
                                            /** jika results */
                                            resolve(resultspart5);
                                        }
                                    })
                                })
                
                                if(pertanyaan_part5.length >= 0){
                                    /** jika tidak error, get data acara */
                                    const dataacara = await new Promise((resolve, reject) => {
                                        Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                            if(error) { 
                                                /** jika error */
                                                reject(error);
                                            } else {
                                                /** jika results */
                                                resolve(results);
                                            }
                                        })
                                    })
                                    if(dataacara.length >= 0){
                                        /** kirim data */
                                        res.status(201).json({ pertanyaan_part5, selectacara, dataacara, partpertanyaan : "5" });
                                    } else {
                                        /** jika error lainnya */
                                        throw new Error('Error, please contact developer');
                                    }
                                } else {
                                    /** jika error lainnya */
                                    throw new Error('Error, please contact developer');
                                }
                            } else if(cek_part5.length > 0) {
                                /** jika user sudah menjawab part 5 pada acara terpilih, kirim notif test selesai */
                                const dataacara = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                        if(error) { 
                                            /** jika error */
                                            reject(error);
                                        } else {
                                            /** jika results */
                                            resolve(results);
                                        }
                                    })
                                })
                                if(dataacara.length >= 0){
                                    /** kirim data */
                                    res.status(201).json({ message: 'Assessment selesai, silahkan logout. Terima kasih', selectacara, dataacara });
                                } else {
                                    /** jika error lainnya */
                                    throw new Error('Error, please contact developer');
                                }
                            } else {
                                /** jika error lainnya */
                                throw new Error('Error, please contact developer');
                            }

                        } else {
                            /** jika error lainnya */
                            throw new Error('Error, please contact developer');
                        }
                    } else {
                        /** jika error lainnya */
                        throw new Error('Error, please contact developer');
                    }
                } else {
                    /** jika error lainnya */
                    throw new Error('Error, please contact developer');
                }

            } else {
                /** jika error lainnya */
                throw new Error('Error, please contact developer');
            }

        } catch(e) {
            res.status(400).json({ message: e.message });    
        }
    } else {
        res.status(400).json({ message: 'Field tidak boleh kosong' });
    }
})

/** Route for list acara */
Router.get('/acaralistassessment', (req, res) =>{
    try{
        Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, results) =>{
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

/** Route for hasil assessment */
Router.post('/hasilassessment', (req, res) =>{
    try{
        const {selectacara} = req.body;

        if(selectacara){
            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND id = ?", [selectacara], async (error, acaraterpilih) => {
                if(error){
                    /** send error */
                    res.status(500).json({
                        message: error
                    })
                } else if(acaraterpilih.length > 0) {
                    /** get data mahasiswa */
                    Connection.query("SELECT u.id AS idmahasiswa, u.unim AS nim, u.unama AS namamahasiswa, u.ufakultas AS fakultas, u.uprodi AS prodi FROM t_user u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN t_acara c ON c.id = a.idacara WHERE u.id NOT IN (SELECT idmahasiswa FROM t_kesimpulan WHERE status = 'aktif') AND u.utipe = 'mahasiswa' AND a.idacara = ? GROUP BY u.id ORDER BY u.unama", [selectacara], async (error, resultcekmahasiswa) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(resultcekmahasiswa.length > 0){
                            Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) =>{
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(dataacara.length >= 0) {
                                    /** send data */
                                    res.status(200).json({
                                        resultcekmahasiswa,
                                        dataacara,
                                        selectacara
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: 'Error, please contact developer'
                                    })
                                }
                            })
                        } else if(resultcekmahasiswa.length == 0) {
                            /** send error */
                            res.status(403).json({
                                message: 'Belum ada mahasiswa yang memberikan jawaban'
                            })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: 'Error, please contact developer'
                            })
                        }
                    })
                } else if(acaraterpilih.length == 0) {
                    /** send error */
                    res.status(403).json({
                        message: 'Acara tidak terdaftar'
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: 'Error, please contact developer'
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for hasil assessment */
Router.post('/hasilassessmentmahasiswa', (req, res) =>{
    try{
        const {selectacara, selectmahasiswa} = req.body;

        if(selectacara && selectmahasiswa) {
            /** cek acara -> cek mahasiswa -> get result hasil assessment mahasiswa per part  */
            Connection.query('SELECT id FROM t_acara WHERE id = ?',[selectacara], async (error, cekacara) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(cekacara.length == 0) {
                    /** Acara tidak terdaftar */
                    res.status(403).json({
                        message: "Acara tidak terdaftar"
                    })
                } else if(cekacara.length > 0) {
                    /** cek mahasiswa */
                    Connection.query('SELECT id FROM t_user WHERE id = ?', [selectmahasiswa], async (error, cekmahasiswa) => {
                        if(error) {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(cekmahasiswa.length == 0) {
                            /** Acara tidak terdaftar */
                            res.status(403).json({
                                message: "Mahasiswa tidak terdaftar"
                            })
                        } else if(cekmahasiswa.length > 0) {
                            /** get data hasil assessment mahasiswa part1 */
                            Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '1' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part1) => {
                                if(error) {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(part1.length >= 0) {
                                    /** get data hasil assessment mahasiswa part2 */
                                    Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '2' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part2) => {
                                        if(error) {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else if(part2.length >= 0) {
                                            /** get data hasil assessment mahasiswa part3 */
                                            Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '3' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part3) => {
                                                if(error) {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    })
                                                } else if(part3.length >= 0) {
                                                    /** get data hasil assessment mahasiswa part4 */
                                                    Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '4' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part4) => {
                                                        if(error){
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            })
                                                        } else if(part4.length >= 0) {
                                                            /** get data hasil assessment mahasiswa part5 */
                                                            Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '5' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part5) => {
                                                                if(error){
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    })
                                                                } else if(part5.length >= 0){
                                                                    /** get data acara */
                                                                    Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) => {
                                                                        if(error) {
                                                                            /** Kirim error */
                                                                            res.status(500).json({
                                                                                message: error
                                                                            })
                                                                        } else if(dataacara.length >= 0) {
                                                                            /** get data mahasiswa yang sudah menjawab */
                                                                            Connection.query("SELECT u.id AS idmahasiswa, u.unim AS nim, u.unama AS namamahasiswa, u.ufakultas AS fakultas, u.uprodi AS prodi FROM t_user u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN t_acara c ON c.id = a.idacara WHERE u.id NOT IN (SELECT idmahasiswa FROM t_kesimpulan WHERE status = 'aktif') AND u.utipe = 'mahasiswa' AND a.idacara = ? GROUP BY u.id ORDER BY u.unama", [selectacara], async (error, resultcekmahasiswa) => {
                                                                                if(error) {
                                                                                    /** Kirim error */
                                                                                    res.status(500).json({
                                                                                        message: error
                                                                                    })
                                                                                } else if(resultcekmahasiswa.length >= 0) {
                                                                                    Connection.query("SELECT m.id AS idmahasiswa, m.unama AS mahasiswa, m.unim AS nim, m.ufakultas AS fakultas, m.uprodi AS prodi FROM t_user m WHERE m.id = ? AND m.utipe = 'mahasiswa' ORDER BY m.unama ASC", [selectmahasiswa], async (error, datamahasiswa) => {
                                                                                        if(error) {
                                                                                            /** Kirim error */
                                                                                            res.status(500).json({
                                                                                                message: error
                                                                                            })
                                                                                        } else if(datamahasiswa.length >= 0) {
                                                                                            /** kirim data */
                                                                                            res.status(200).json({
                                                                                                part1, part2, part3, part4, part5,
                                                                                                selectacara, selectmahasiswa, dataacara, resultcekmahasiswa, datamahasiswa,
                                                                                            })
                                                                                        } else {
                                                                                            /** Kirim error */
                                                                                            res.status(403).json({
                                                                                                message: "Error, please contact developer"
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    /** Kirim error */
                                                                                    res.status(403).json({
                                                                                        message: "Error, please contact developer"
                                                                                    })
                                                                                }
                                                                            })
                                                                        } else {
                                                                            /** Kirim error */
                                                                            res.status(403).json({
                                                                                message: "Error, please contact developer"
                                                                            })   
                                                                        }
                                                                    })
                                                                } else {
                                                                    /** Kirim error */
                                                                    res.status(403).json({
                                                                        message: "Error, please contact developer"
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(403).json({
                                                                message: "Error, please contact developer"
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    /** Kirim error */
                                                    res.status(403).json({
                                                        message: "Error, please contact developer"
                                                    })
                                                }
                                            })
                                        } else {
                                            /** Kirim error */
                                            res.status(403).json({
                                                message: "Error, please contact developer"
                                            })
                                        }
                                    })
                                } else {
                                    /** Kirim error */
                                    res.status(403).json({
                                        message: "Error, please contact developer"
                                    })
                                }
                            })
                        } else {
                            /** Kirim error */
                            res.status(403).json({
                                message: "Error, please contact developer"
                            })
                        }
                    })
                } else {
                    /** Kirim error */
                    res.status(403).json({
                        message: "Error, please contact developer"
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for kesimpulan assessment */
Router.post('/kesimpulanassessment', (req, res) =>{
    try{
        const {selectacara} = req.body;

        if(selectacara){
            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND id = ?", [selectacara], async (error, acaraterpilih) => {
                if(error){
                    /** send error */
                    res.status(500).json({
                        message: error
                    })
                } else if(acaraterpilih.length > 0) {
                    /** get data mahasiswa */
                    Connection.query("SELECT u.id AS idmahasiswa, u.unim AS nim, u.unama AS namamahasiswa, u.ufakultas AS fakultas, u.uprodi AS prodi FROM t_user u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN t_acara c ON c.id = a.idacara WHERE u.id IN (SELECT idmahasiswa FROM t_kesimpulan WHERE NOT status = 'hapus') AND u.utipe = 'mahasiswa' AND a.idacara = ? GROUP BY u.id ORDER BY u.unama", [selectacara], async (error, resultcekmahasiswa) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(resultcekmahasiswa.length > 0){
                            Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) =>{
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(dataacara.length >= 0) {
                                    /** send data */
                                    res.status(200).json({
                                        resultcekmahasiswa,
                                        dataacara,
                                        selectacara
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: 'Error, please contact developer'
                                    })
                                }
                            })
                        } else if(resultcekmahasiswa.length == 0) {
                            /** send error */
                            res.status(403).json({
                                message: 'Belum ada mahasiswa yang diberikan kesimpulan'
                            })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: 'Error, please contact developer'
                            })
                        }
                    })
                } else if(acaraterpilih.length == 0) {
                    /** send error */
                    res.status(403).json({
                        message: 'Acara tidak terdaftar'
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: 'Error, please contact developer'
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for kesimpulan assessment */
Router.post('/kesimpulanassessmenthapus', (req, res) =>{
    try{
        const {selectacara} = req.body;

        if(selectacara){
            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND id = ?", [selectacara], async (error, acaraterpilih) => {
                if(error){
                    /** send error */
                    res.status(500).json({
                        message: error
                    })
                } else if(acaraterpilih.length > 0) {
                    /** get data mahasiswa */
                    Connection.query("SELECT u.id AS idmahasiswa, u.unim AS nim, u.unama AS namamahasiswa, u.ufakultas AS fakultas, u.uprodi AS prodi FROM t_user u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN t_acara c ON c.id = a.idacara WHERE u.id IN (SELECT idmahasiswa FROM t_kesimpulan WHERE NOT status = 'hapus') AND u.utipe = 'mahasiswa' AND a.idacara = ? GROUP BY u.id ORDER BY u.unama", [selectacara], async (error, resultcekmahasiswa) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(resultcekmahasiswa.length >= 0){
                            Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) =>{
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(dataacara.length >= 0) {
                                    /** send data */
                                    res.status(200).json({
                                        resultcekmahasiswa,
                                        dataacara,
                                        selectacara
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: 'Error, please contact developer'
                                    })
                                }
                            })
                        // } else if(resultcekmahasiswa.length == 0) {
                        //     /** send error */
                        //     res.status(403).json({
                        //         message: 'Belum ada mahasiswa yang diberikan kesimpulan'
                        //     })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: 'Error, please contact developer'
                            })
                        }
                    })
                } else if(acaraterpilih.length == 0) {
                    /** send error */
                    res.status(403).json({
                        message: 'Acara tidak terdaftar'
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: 'Error, please contact developer'
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for kesimpulan assessment */
Router.post('/kesimpulanassessmentmahasiswa', (req, res) =>{
    try{
        const {selectacara, selectmahasiswa} = req.body;

        if(selectacara && selectmahasiswa) {
            /** cek acara */
            Connection.query('SELECT id FROM t_acara WHERE id = ?',[selectacara], async (error, cekacara) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(cekacara.length == 0) {
                    /** Acara tidak terdaftar */
                    res.status(403).json({
                        message: "Acara tidak terdaftar"
                    })
                } else if(cekacara.length > 0) {
                    /** cek mahasiswa */
                    Connection.query('SELECT id FROM t_user WHERE id = ?', [selectmahasiswa], async (error, cekmahasiswa) => {
                        if(error) {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(cekmahasiswa.length == 0) {
                            /** Acara tidak terdaftar */
                            res.status(403).json({
                                message: "Mahasiswa tidak terdaftar"
                            })
                        } else if(cekmahasiswa.length > 0) {
                            /** get data hasil assessment mahasiswa part1 */
                            Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '1' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part1) => {
                                if(error) {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(part1.length >= 0) {
                                    /** get data hasil assessment mahasiswa part2 */
                                    Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '2' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part2) => {
                                        if(error) {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else if(part2.length >= 0) {
                                            /** get data hasil assessment mahasiswa part3 */
                                            Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '3' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part3) => {
                                                if(error) {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    })
                                                } else if(part3.length >= 0) {
                                                    /** get data hasil assessment mahasiswa part4 */
                                                    Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '4' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part4) => {
                                                        if(error){
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            })
                                                        } else if(part4.length >= 0) {
                                                            /** get data hasil assessment mahasiswa part5 */
                                                            Connection.query("SELECT view_total_skor_mhs_acara.acara, view_total_skor_mhs_acara.nim, view_total_skor_mhs_acara.mahasiswa, view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idmahasiswa = ? AND view_total_skor_mhs_acara.idpart = '5' AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectmahasiswa, selectacara], async (error, part5) => {
                                                                if(error){
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    })
                                                                } else if(part5.length >= 0){
                                                                    /** get data acara */
                                                                    Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) => {
                                                                        if(error) {
                                                                            /** Kirim error */
                                                                            res.status(500).json({
                                                                                message: error
                                                                            })
                                                                        } else if(dataacara.length >= 0) {
                                                                            /** get data mahasiswa yang sudah menjawab */
                                                                            Connection.query("SELECT u.id AS idmahasiswa, u.unim AS nim, u.unama AS namamahasiswa, u.ufakultas AS fakultas, u.uprodi AS prodi FROM t_user u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN t_acara c ON c.id = a.idacara WHERE u.id IN (SELECT idmahasiswa FROM t_kesimpulan WHERE NOT status = 'hapus') AND u.utipe = 'mahasiswa' AND a.idacara = ? GROUP BY u.id ORDER BY u.unama", [selectacara], async (error, resultcekmahasiswa) => {
                                                                                if(error) {
                                                                                    /** Kirim error */
                                                                                    res.status(500).json({
                                                                                        message: error
                                                                                    })
                                                                                } else if(resultcekmahasiswa.length >= 0) {
                                                                                    Connection.query("SELECT m.id AS idmahasiswa, m.unama AS mahasiswa, m.unim AS nim, m.ufakultas AS fakultas, m.uprodi AS prodi FROM t_user m WHERE m.id = ? AND m.utipe = 'mahasiswa' ORDER BY m.unama ASC", [selectmahasiswa], async (error, datamahasiswa) => {
                                                                                        if(error) {
                                                                                            /** Kirim error */
                                                                                            res.status(500).json({
                                                                                                message: error
                                                                                            })
                                                                                        } else if(datamahasiswa.length >= 0) {
                                                                                            /** Ambil data kesimpulan */
                                                                                            Connection.query("SELECT u.id AS idpsikolog, u.unama AS namapsikolog, k.id AS idkesimpulan, k.kesimpulan AS kesimpulan FROM t_kesimpulan k INNER JOIN t_acara a ON a.id = k.idacara INNER JOIN t_user u ON u.id = k.idpsikolog WHERE k.idacara = ? AND k.idmahasiswa = ? AND NOT k.status = 'hapus' ", [selectacara, selectmahasiswa], async (error, datakesimpulan) => {
                                                                                                if(error) {
                                                                                                    /** Kirim error */
                                                                                                    res.status(500).json({
                                                                                                        message: error
                                                                                                    })
                                                                                                } else {
                                                                                                    /** kirim data */
                                                                                                    res.status(200).json({
                                                                                                        part1, part2, part3, part4, part5,
                                                                                                        selectacara, selectmahasiswa, dataacara, resultcekmahasiswa, datamahasiswa, datakesimpulan
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            /** Kirim error */
                                                                                            res.status(403).json({
                                                                                                message: "Error, please contact developer"
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    /** Kirim error */
                                                                                    res.status(403).json({
                                                                                        message: "Error, please contact developer"
                                                                                    })
                                                                                }
                                                                            })
                                                                        } else {
                                                                            /** Kirim error */
                                                                            res.status(403).json({
                                                                                message: "Error, please contact developer"
                                                                            })   
                                                                        }
                                                                    })
                                                                } else {
                                                                    /** Kirim error */
                                                                    res.status(403).json({
                                                                        message: "Error, please contact developer"
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(403).json({
                                                                message: "Error, please contact developer"
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    /** Kirim error */
                                                    res.status(403).json({
                                                        message: "Error, please contact developer"
                                                    })
                                                }
                                            })
                                        } else {
                                            /** Kirim error */
                                            res.status(403).json({
                                                message: "Error, please contact developer"
                                            })
                                        }
                                    })
                                } else {
                                    /** Kirim error */
                                    res.status(403).json({
                                        message: "Error, please contact developer"
                                    })
                                }
                            })
                        } else {
                            /** Kirim error */
                            res.status(403).json({
                                message: "Error, please contact developer"
                            })
                        }
                    })
                } else {
                    /** Kirim error */
                    res.status(403).json({
                        message: "Error, please contact developer"
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for hasil assessment prodi */
Router.post('/hasilassessmentprodi', (req, res) =>{
    try{
        const {selectacara} = req.body;

        if(selectacara){
            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND id = ?", [selectacara], async (error, acaraterpilih) => {
                if(error){
                    /** send error */
                    res.status(500).json({
                        message: error
                    })
                } else if(acaraterpilih.length > 0) {
                    /** get data prodi */
                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi NOT IN (SELECT prodi FROM t_kesimpulan_prodi WHERE idacara = ? AND NOT status = 'hapus') GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara, selectacara], async (error, resultcekprodi) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(resultcekprodi.length > 0){
                            Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) =>{
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(dataacara.length >= 0) {
                                    /** send data */
                                    res.status(200).json({
                                        resultcekprodi,
                                        dataacara,
                                        selectacara
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: 'Error, please contact developer'
                                    })
                                }
                            })
                        } else if(resultcekprodi.length == 0) {
                            /** send error */
                            res.status(403).json({
                                message: 'Belum ada mahasiswa yang memberikan jawaban'
                            })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: 'Error, please contact developer'
                            })
                        }
                    })
                } else if(acaraterpilih.length == 0) {
                    /** send error */
                    res.status(403).json({
                        message: 'Acara tidak terdaftar'
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: 'Error, please contact developer'
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for hasil assessment program studi */
Router.post('/hasilassessmentprogramstudi', (req, res) =>{
    try{
        const {selectacara, selectprodi} = req.body;

        if(selectacara && selectprodi) {
            /** cek acara */
            Connection.query('SELECT id FROM t_acara WHERE id = ?',[selectacara], async (error, cekacara) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(cekacara.length == 0) {
                    /** Acara tidak terdaftar */
                    res.status(403).json({
                        message: "Acara tidak terdaftar"
                    })
                } else if(cekacara.length > 0) {
                    /** cek prodi */
                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi = ? GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara, selectprodi], async (error, cekprodi) => {
                        if(error) {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(cekprodi.length == 0) {
                            /** Acara tidak terdaftar */
                            res.status(403).json({
                                message: "prodi tidak terdaftar"
                            })
                        } else if(cekprodi.length > 0) {
                            /** get data hasil assessment prodi part1 */
                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 1 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part1) => {
                                if(error) {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(part1.length >= 0) {
                                    /** get data hasil assessment prodi part2 */
                                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 2 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part2) => {
                                        if(error) {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else if(part2.length >= 0) {
                                            /** get data hasil assessment prodi part3 */
                                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 3 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part3) => {
                                                if(error) {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    })
                                                } else if(part3.length >= 0) {
                                                    /** get data hasil assessment prodi part4 */
                                                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 4 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part4) => {
                                                        if(error){
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            })
                                                        } else if(part4.length >= 0) {
                                                            /** get data hasil assessment prodi part5 */
                                                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 5 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part5) => {
                                                                if(error){
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    })
                                                                } else if(part5.length >= 0){
                                                                    /** get data acara */
                                                                    Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) => {
                                                                        if(error) {
                                                                            /** Kirim error */
                                                                            res.status(500).json({
                                                                                message: error
                                                                            })
                                                                        } else if(dataacara.length >= 0) {
                                                                            /** get data prodi yang mahasiswanya sudah menjawab */
                                                                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara], async (error, resultcekprodi) => {
                                                                                if(error) {
                                                                                    /** Kirim error */
                                                                                    res.status(500).json({
                                                                                        message: error
                                                                                    })
                                                                                } else if(resultcekprodi.length >= 0) {
                                                                                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi = ? GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara, selectprodi], async (error, dataprodi) => {
                                                                                        if(error) {
                                                                                            /** Kirim error */
                                                                                            res.status(500).json({
                                                                                                message: error
                                                                                            })
                                                                                        } else if(dataprodi.length >= 0) {
                                                                                            /** kirim data */
                                                                                            res.status(200).json({
                                                                                                part1, part2, part3, part4, part5,
                                                                                                selectacara, dataacara, resultcekprodi, selectprodi, dataprodi
                                                                                            })
                                                                                        } else {
                                                                                            /** Kirim error */
                                                                                            res.status(403).json({
                                                                                                message: "Error, please contact developer"
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    /** Kirim error */
                                                                                    res.status(403).json({
                                                                                        message: "Error, please contact developer"
                                                                                    })
                                                                                }
                                                                            })
                                                                        } else {
                                                                            /** Kirim error */
                                                                            res.status(403).json({
                                                                                message: "Error, please contact developer"
                                                                            })   
                                                                        }
                                                                    })
                                                                } else {
                                                                    /** Kirim error */
                                                                    res.status(403).json({
                                                                        message: "Error, please contact developer"
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(403).json({
                                                                message: "Error, please contact developer"
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    /** Kirim error */
                                                    res.status(403).json({
                                                        message: "Error, please contact developer"
                                                    })
                                                }
                                            })
                                        } else {
                                            /** Kirim error */
                                            res.status(403).json({
                                                message: "Error, please contact developer"
                                            })
                                        }
                                    })
                                } else {
                                    /** Kirim error */
                                    res.status(403).json({
                                        message: "Error, please contact developer"
                                    })
                                }
                            })
                        } else {
                            /** Kirim error */
                            res.status(403).json({
                                message: "Error, please contact developer"
                            })
                        }
                    })
                } else {
                    /** Kirim error */
                    res.status(403).json({
                        message: "Error, please contact developer"
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for kesimpulan assessment */
Router.post('/kesimpulanassessmentprodi', (req, res) =>{
    try{
        const {selectacara} = req.body;

        if(selectacara){
            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND id = ?", [selectacara], async (error, acaraterpilih) => {
                if(error){
                    /** send error */
                    res.status(500).json({
                        message: error
                    })
                } else if(acaraterpilih.length > 0) {
                    /** get data prodi */
                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi IN (SELECT prodi FROM t_kesimpulan_prodi WHERE idacara = ? AND NOT status = 'hapus') GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara, selectacara], async (error, resultcekprodi) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(resultcekprodi.length > 0){
                            Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) =>{
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(dataacara.length >= 0) {
                                    /** send data */
                                    res.status(200).json({
                                        resultcekprodi,
                                        dataacara,
                                        selectacara
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: 'Error, please contact developer'
                                    })
                                }
                            })
                        } else if(resultcekprodi.length == 0) {
                            /** send error */
                            res.status(403).json({
                                message: 'Belum ada prodi yang diberikan kesimpulan'
                            })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: 'Error, please contact developer'
                            })
                        }
                    })
                } else if(acaraterpilih.length == 0) {
                    /** send error */
                    res.status(403).json({
                        message: 'Acara tidak terdaftar'
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: 'Error, please contact developer'
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for kesimpulan assessment */
Router.post('/kesimpulanassessmentprodihapus', (req, res) =>{
    try{
        const {selectacara} = req.body;

        if(selectacara){
            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND id = ?", [selectacara], async (error, acaraterpilih) => {
                if(error){
                    /** send error */
                    res.status(500).json({
                        message: error
                    })
                } else if(acaraterpilih.length > 0) {
                    /** get data prodi */
                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi IN (SELECT prodi FROM t_kesimpulan_prodi WHERE idacara = ? AND NOT status = 'hapus') GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara, selectacara], async (error, resultcekprodi) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(resultcekprodi.length >= 0){
                            Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) =>{
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(dataacara.length >= 0) {
                                    /** send data */
                                    res.status(200).json({
                                        resultcekprodi,
                                        dataacara,
                                        selectacara
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: 'Error, please contact developer'
                                    })
                                }
                            })
                        // } else if(resultcekprodi.length == 0) {
                        //     /** send error */
                        //     res.status(403).json({
                        //         message: 'Belum ada prodi yang diberikan kesimpulan'
                        //     })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: 'Error, please contact developer'
                            })
                        }
                    })
                } else if(acaraterpilih.length == 0) {
                    /** send error */
                    res.status(403).json({
                        message: 'Acara tidak terdaftar'
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: 'Error, please contact developer'
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for kesimpulan assessment */
Router.post('/kesimpulanassessmentprogramstudi', (req, res) =>{
    try{
        const {selectacara, selectprodi} = req.body;

        if(selectacara && selectprodi) {
            /** cek acara */
            Connection.query('SELECT id FROM t_acara WHERE id = ?',[selectacara], async (error, cekacara) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(cekacara.length == 0) {
                    /** Acara tidak terdaftar */
                    res.status(403).json({
                        message: "Acara tidak terdaftar"
                    })
                } else if(cekacara.length > 0) {
                    /** cek prodi */
                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi = ? GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara, selectprodi], async (error, cekprodi) => {
                        if(error) {
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(cekprodi.length == 0) {
                            /** Acara tidak terdaftar */
                            res.status(403).json({
                                message: "prodi tidak terdaftar"
                            })
                        } else if(cekprodi.length > 0) {
                            /** get data hasil assessment prodi part1 */
                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 1 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part1) => {
                                if(error) {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(part1.length >= 0) {
                                    /** get data hasil assessment prodi part2 */
                                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 2 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part2) => {
                                        if(error) {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else if(part2.length >= 0) {
                                            /** get data hasil assessment prodi part3 */
                                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 3 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part3) => {
                                                if(error) {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    })
                                                } else if(part3.length >= 0) {
                                                    /** get data hasil assessment prodi part4 */
                                                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 4 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part4) => {
                                                        if(error){
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            })
                                                        } else if(part4.length >= 0) {
                                                            /** get data hasil assessment prodi part5 */
                                                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, ROUND(AVG(view_total_skor_mhs_acara.skor), 2) as skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.prodi = ? AND view_total_skor_mhs_acara.idpart = 5 AND view_total_skor_mhs_acara.idacara = ? GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectprodi, selectacara], async (error, part5) => {
                                                                if(error){
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    })
                                                                } else if(part5.length >= 0){
                                                                    /** get data acara */
                                                                    Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", async (error, dataacara) => {
                                                                        if(error) {
                                                                            /** Kirim error */
                                                                            res.status(500).json({
                                                                                message: error
                                                                            })
                                                                        } else if(dataacara.length >= 0) {
                                                                            /** get data prodi yang mahasiswanya sudah menjawab */
                                                                            Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi IN (SELECT prodi FROM t_kesimpulan_prodi WHERE status = 'aktif') GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara], async (error, resultcekprodi) => {
                                                                                if(error) {
                                                                                    /** Kirim error */
                                                                                    res.status(500).json({
                                                                                        message: error
                                                                                    })
                                                                                } else if(resultcekprodi.length >= 0) {
                                                                                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi = ? GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi", [selectacara, selectprodi], async (error, dataprodi) => {
                                                                                        if(error) {
                                                                                            /** Kirim error */
                                                                                            res.status(500).json({
                                                                                                message: error
                                                                                            })
                                                                                        } else if(dataprodi.length >= 0) {
                                                                                            /** Ambil data kesimpulan */
                                                                                            Connection.query("SELECT u.id AS idpsikolog, u.unama AS namapsikolog, k.id AS idkesimpulan, k.kesimpulan AS kesimpulan FROM t_kesimpulan_prodi k INNER JOIN t_acara a ON a.id = k.idacara INNER JOIN t_user u ON u.id = k.idpsikolog WHERE k.idacara = ? AND k.prodi = ? AND NOT k.status = 'hapus'", [selectacara, selectprodi], async (error, datakesimpulan) => {
                                                                                                if(error) {
                                                                                                    /** Kirim error */
                                                                                                    res.status(500).json({
                                                                                                        message: error
                                                                                                    })
                                                                                                } else {
                                                                                                    /** kirim data */
                                                                                                    res.status(200).json({
                                                                                                        part1, part2, part3, part4, part5,
                                                                                                        selectacara, dataacara, resultcekprodi, selectprodi, dataprodi, datakesimpulan
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            /** Kirim error */
                                                                                            res.status(403).json({
                                                                                                message: "Error, please contact developer"
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    /** Kirim error */
                                                                                    res.status(403).json({
                                                                                        message: "Error, please contact developer"
                                                                                    })
                                                                                }
                                                                            })
                                                                        } else {
                                                                            /** Kirim error */
                                                                            res.status(403).json({
                                                                                message: "Error, please contact developer"
                                                                            })   
                                                                        }
                                                                    })
                                                                } else {
                                                                    /** Kirim error */
                                                                    res.status(403).json({
                                                                        message: "Error, please contact developer"
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(403).json({
                                                                message: "Error, please contact developer"
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    /** Kirim error */
                                                    res.status(403).json({
                                                        message: "Error, please contact developer"
                                                    })
                                                }
                                            })
                                        } else {
                                            /** Kirim error */
                                            res.status(403).json({
                                                message: "Error, please contact developer"
                                            })
                                        }
                                    })
                                } else {
                                    /** Kirim error */
                                    res.status(403).json({
                                        message: "Error, please contact developer"
                                    })
                                }
                            })
                        } else {
                            /** Kirim error */
                            res.status(403).json({
                                message: "Error, please contact developer"
                            })
                        }
                    })
                } else {
                    /** Kirim error */
                    res.status(403).json({
                        message: "Error, please contact developer"
                    })
                }
            })
        } else {
            /** Kirim error */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for skor assessment */
Router.post('/skorassessment', async (req, res) =>{
    const {selectacara} = req.body;

    if(selectacara) {
        try{
            const cek_acara = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM t_acara WHERE id = ?", [selectacara], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            if(cek_acara.length > 0) {
                /** data acara terdaftar */
                /** get data hasil assessment mahasiswa part1 */
                const part1 = await new Promise((resolve, reject) => {
                    Connection.query("SELECT unim, sum(IF(idsoal = '1', jawab, 0)) AS '1', sum(IF(idsoal = '2', jawab, 0)) AS '2', sum(IF(idsoal = '3', jawab, 0)) AS '3', sum(IF(idsoal = '4', jawab, 0)) AS '4', sum(IF(idsoal = '5', jawab, 0)) AS '5', sum(IF(idsoal = '6', jawab, 0)) AS '6', sum(IF(idsoal = '7', jawab, 0)) AS '7', sum(IF(idsoal = '8', jawab, 0)) AS '8', sum(IF(idsoal = '9', jawab, 0)) AS '9', sum(IF(idsoal = '10', jawab, 0)) AS '10', sum(IF(idsoal = '11', jawab, 0)) AS '11', sum(IF(idsoal = '12', jawab, 0)) AS '12', sum(IF(idsoal = '13', jawab, 0)) AS '13', sum(IF(idsoal = '14', jawab, 0)) AS '14', sum(IF(idsoal = '15', jawab, 0)) AS '15', sum(IF(idsoal = '16', jawab, 0)) AS '16', sum(IF(idsoal = '17', jawab, 0)) AS '17', sum(IF(idsoal = '18', jawab, 0)) AS '18', sum(IF(idsoal = '19', jawab, 0)) AS '19', sum(IF(idsoal = '20', jawab, 0)) AS '20', sum(IF(idsoal = '21', jawab, 0)) AS '21', sum(IF(idsoal = '22', jawab, 0)) AS '22', sum(IF(idsoal = '23', jawab, 0)) AS '23', sum(IF(idsoal = '24', jawab, 0)) AS '24', sum(IF(idsoal = '25', jawab, 0)) AS '25', sum(IF(idsoal = '26', jawab, 0)) AS '26', sum(IF(idsoal = '27', jawab, 0)) AS '27', sum(IF(idsoal = '28', jawab, 0)) AS '28', sum(IF(idsoal = '29', jawab, 0)) AS '29', sum(IF(idsoal = '30', jawab, 0)) AS '30', sum(IF(idsoal < 31, jawab, 0)) AS Jumlah FROM t_answer JOIN t_user ON t_answer.iduser = t_user.id WHERE t_answer.idacara = ? GROUP BY iduser", [selectacara], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** get data hasil assessment mahasiswa part2 */
                const part2 = await new Promise((resolve, reject) => {
                    Connection.query("SELECT unim, sum(IF(idsoal = '31', jawab, 0)) AS '1', sum(IF(idsoal = '32', jawab, 0)) AS '2', sum(IF(idsoal = '33', jawab, 0)) AS '3', sum(IF(idsoal = '34', jawab, 0)) AS '4', sum(IF(idsoal = '35', jawab, 0)) AS '5', sum(IF(idsoal = '36', jawab, 0)) AS '6', sum(IF(idsoal = '37', jawab, 0)) AS '7', sum(IF(idsoal = '38', jawab, 0)) AS '8', sum(IF(idsoal = '39', jawab, 0)) AS '9', sum(IF(idsoal = '40', jawab, 0)) AS '10', sum(IF(idsoal = '41', jawab, 0)) AS '11', sum(IF(idsoal = '42', jawab, 0)) AS '12', sum(IF(idsoal = '43', jawab, 0)) AS '13', sum(IF(idsoal = '44', jawab, 0)) AS '14', sum(IF(idsoal = '45', jawab, 0)) AS '15', sum(IF(idsoal = '46', jawab, 0)) AS '16', sum(IF(idsoal = '47', jawab, 0)) AS '17', sum(IF(idsoal = '48', jawab, 0)) AS '18', sum(IF(idsoal = '49', jawab, 0)) AS '19', sum(IF(idsoal = '50', jawab, 0)) AS '20', sum(IF(idsoal = '51', jawab, 0)) AS '21', sum(IF(idsoal = '52', jawab, 0)) AS '22', sum(IF(idsoal = '53', jawab, 0)) AS '23', sum(IF(idsoal = '54', jawab, 0)) AS '24', sum(IF(idsoal = '55', jawab, 0)) AS '25', sum(IF(idsoal < 56 AND idsoal > 30, jawab, 0)) AS Jumlah FROM t_answer JOIN t_user ON t_answer.iduser = t_user.id WHERE t_answer.idacara = ? GROUP BY iduser", [selectacara], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** get data hasil assessment mahasiswa part3 */
                const part3 = await new Promise((resolve, reject) => {
                    Connection.query("SELECT unim, sum(IF(idsoal = '56', jawab, 0)) AS '1', sum(IF(idsoal = '57', jawab, 0)) AS '2', sum(IF(idsoal = '58', jawab, 0)) AS '3', sum(IF(idsoal = '59', jawab, 0)) AS '4', sum(IF(idsoal = '60', jawab, 0)) AS '5', sum(IF(idsoal = '61', jawab, 0)) AS '6', sum(IF(idsoal = '62', jawab, 0)) AS '7', sum(IF(idsoal = '63', jawab, 0)) AS '8', sum(IF(idsoal = '64', jawab, 0)) AS '9', sum(IF(idsoal = '65', jawab, 0)) AS '10', sum(IF(idsoal = '66', jawab, 0)) AS '11', sum(IF(idsoal = '67', jawab, 0)) AS '12', sum(IF(idsoal = '68', jawab, 0)) AS '13', sum(IF(idsoal = '69', jawab, 0)) AS '14', sum(IF(idsoal = '70', jawab, 0)) AS '15', sum(IF(idsoal = '71', jawab, 0)) AS '16', sum(IF(idsoal = '72', jawab, 0)) AS '17', sum(IF(idsoal = '73', jawab, 0)) AS '18', sum(IF(idsoal = '74', jawab, 0)) AS '19', sum(IF(idsoal = '75', jawab, 0)) AS '20', sum(IF(idsoal = '76', jawab, 0)) AS '21', sum(IF(idsoal = '77', jawab, 0)) AS '22', sum(IF(idsoal = '78', jawab, 0)) AS '23', sum(IF(idsoal = '79', jawab, 0)) AS '24', sum(IF(idsoal = '80', jawab, 0)) AS '25', sum(IF(idsoal = '81', jawab, 0)) AS '26', sum(IF(idsoal = '82', jawab, 0)) AS '27', sum(IF(idsoal = '83', jawab, 0)) AS '28', sum(IF(idsoal = '84', jawab, 0)) AS '29', sum(IF(idsoal = '85', jawab, 0)) AS '30', sum(IF(idsoal = '86', jawab, 0)) AS '31', sum(IF(idsoal = '87', jawab, 0)) AS '32', sum(IF(idsoal = '88', jawab, 0)) AS '33', sum(IF(idsoal = '89', jawab, 0)) AS '34', sum(IF(idsoal = '90', jawab, 0)) AS '35', sum(IF(idsoal = '91', jawab, 0)) AS '36', sum(IF(idsoal = '92', jawab, 0)) AS '37', sum(IF(idsoal = '93', jawab, 0)) AS '38', sum(IF(idsoal = '94', jawab, 0)) AS '39', sum(IF(idsoal = '95', jawab, 0)) AS '40', sum(IF(idsoal = '96', jawab, 0)) AS '41', sum(IF(idsoal = '97', jawab, 0)) AS '42', sum(IF(idsoal > 55 AND idsoal < 98, jawab, 0)) AS Jumlah FROM t_answer JOIN t_user ON t_answer.iduser = t_user.id WHERE t_answer.idacara = ? GROUP BY iduser", [selectacara], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** get data hasil assessment mahasiswa part4 */
                const part4 = await new Promise((resolve, reject) => {
                    Connection.query("SELECT unim, sum(IF(idsoal = '98', jawab, 0)) AS '1', sum(IF(idsoal = '99', jawab, 0)) AS '2', sum(IF(idsoal = '100', jawab, 0)) AS '3', sum(IF(idsoal = '101', jawab, 0)) AS '4', sum(IF(idsoal = '102', jawab, 0)) AS '5', sum(IF(idsoal = '103', jawab, 0)) AS '6', sum(IF(idsoal = '104', jawab, 0)) AS '7', sum(IF(idsoal = '105', jawab, 0)) AS '8', sum(IF(idsoal = '106', jawab, 0)) AS '9', sum(IF(idsoal = '107', jawab, 0)) AS '10', sum(IF(idsoal = '108', jawab, 0)) AS '11', sum(IF(idsoal = '109', jawab, 0)) AS '12', sum(IF(idsoal = '110', jawab, 0)) AS '13', sum(IF(idsoal = '111', jawab, 0)) AS '14', sum(IF(idsoal = '112', jawab, 0)) AS '15', sum(IF(idsoal = '113', jawab, 0)) AS '16', sum(IF(idsoal = '114', jawab, 0)) AS '17', sum(IF(idsoal = '115', jawab, 0)) AS '18', sum(IF(idsoal = '116', jawab, 0)) AS '19', sum(IF(idsoal = '117', jawab, 0)) AS '20', sum(IF(idsoal = '118', jawab, 0)) AS '21', sum(IF(idsoal = '119', jawab, 0)) AS '22', sum(IF(idsoal = '120', jawab, 0)) AS '23', sum(IF(idsoal = '121', jawab, 0)) AS '24', sum(IF(idsoal = '122', jawab, 0)) AS '25', sum(IF(idsoal = '123', jawab, 0)) AS '26', sum(IF(idsoal = '124', jawab, 0)) AS '27', sum(IF(idsoal = '125', jawab, 0)) AS '28', sum(IF(idsoal = '126', jawab, 0)) AS '29', sum(IF(idsoal = '127', jawab, 0)) AS '30', sum(IF(idsoal = '128', jawab, 0)) AS '31', sum(IF(idsoal = '129', jawab, 0)) AS '32', sum(IF(idsoal = '130', jawab, 0)) AS '33', sum(IF(idsoal = '131', jawab, 0)) AS '34', sum(IF(idsoal = '132', jawab, 0)) AS '35', sum(IF(idsoal = '133', jawab, 0)) AS '36', sum(IF(idsoal = '134', jawab, 0)) AS '37', sum(IF(idsoal = '135', jawab, 0)) AS '38', sum(IF(idsoal = '136', jawab, 0)) AS '39', sum(IF(idsoal = '137', jawab, 0)) AS '40', sum(IF(idsoal = '138', jawab, 0)) AS '41', sum(IF(idsoal = '139', jawab, 0)) AS '42', sum(IF(idsoal = '140', jawab, 0)) AS '43', sum(IF(idsoal = '141', jawab, 0)) AS '44', sum(IF(idsoal = '142', jawab, 0)) AS '45', sum(IF(idsoal = '143', jawab, 0)) AS '46', sum(IF(idsoal = '144', jawab, 0)) AS '47', sum(IF(idsoal = '145', jawab, 0)) AS '48', sum(IF(idsoal = '146', jawab, 0)) AS '49', sum(IF(idsoal = '147', jawab, 0)) AS '50', sum(IF(idsoal < 148 AND idsoal > 97, jawab, 0)) AS Jumlah FROM t_answer JOIN t_user ON t_answer.iduser = t_user.id WHERE t_answer.idacara = ? GROUP BY iduser", [selectacara], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** get data hasil assessment mahasiswa part5 */
                const part5 = await new Promise((resolve, reject) => {
                    Connection.query("SELECT unim, sum(IF(idsoal = '148', jawab, 0)) AS '1', sum(IF(idsoal = '149', jawab, 0)) AS '2', sum(IF(idsoal = '150', jawab, 0)) AS '3', sum(IF(idsoal = '151', jawab, 0)) AS '4', sum(IF(idsoal = '152', jawab, 0)) AS '5', sum(IF(idsoal = '153', jawab, 0)) AS '6', sum(IF(idsoal = '154', jawab, 0)) AS '7', sum(IF(idsoal = '155', jawab, 0)) AS '8', sum(IF(idsoal = '156', jawab, 0)) AS '9', sum(IF(idsoal = '157', jawab, 0)) AS '10', sum(IF(idsoal = '158', jawab, 0)) AS '11', sum(IF(idsoal = '159', jawab, 0)) AS '12', sum(IF(idsoal = '160', jawab, 0)) AS '13', sum(IF(idsoal = '161', jawab, 0)) AS '14', sum(IF(idsoal = '162', jawab, 0)) AS '15', sum(IF(idsoal = '163', jawab, 0)) AS '16', sum(IF(idsoal = '164', jawab, 0)) AS '17', sum(IF(idsoal = '165', jawab, 0)) AS '18', sum(IF(idsoal = '166', jawab, 0)) AS '19', sum(IF(idsoal = '167', jawab, 0)) AS '20', sum(IF(idsoal = '168', jawab, 0)) AS '21', sum(IF(idsoal = '169', jawab, 0)) AS '22', sum(IF(idsoal = '170', jawab, 0)) AS '23', sum(IF(idsoal = '171', jawab, 0)) AS '24', sum(IF(idsoal = '172', jawab, 0)) AS '25', sum(IF(idsoal = '173', jawab, 0)) AS '26', sum(IF(idsoal = '174', jawab, 0)) AS '27', sum(IF(idsoal = '175', jawab, 0)) AS '28', sum(IF(idsoal = '176', jawab, 0)) AS '29', sum(IF(idsoal = '177', jawab, 0)) AS '30', sum(IF(idsoal = '178', jawab, 0)) AS '31', sum(IF(idsoal = '179', jawab, 0)) AS '32', sum(IF(idsoal = '180', jawab, 0)) AS '33', sum(IF(idsoal = '181', jawab, 0)) AS '34', sum(IF(idsoal = '182', jawab, 0)) AS '35', sum(IF(idsoal = '183', jawab, 0)) AS '36', sum(IF(idsoal = '184', jawab, 0)) AS '37', sum(IF(idsoal = '185', jawab, 0)) AS '38', sum(IF(idsoal = '186', jawab, 0)) AS '39', sum(IF(idsoal = '187', jawab, 0)) AS '40', sum(IF(idsoal = '188', jawab, 0)) AS '41', sum(IF(idsoal = '189', jawab, 0)) AS '42', sum(IF(idsoal = '190', jawab, 0)) AS '43', sum(IF(idsoal = '191', jawab, 0)) AS '44', sum(IF(idsoal > 147, jawab, 0)) AS Jumlah FROM t_answer JOIN t_user ON t_answer.iduser = t_user.id WHERE t_answer.idacara = ? GROUP BY iduser", [selectacara], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** get data acara */
                const dataacara = await new Promise((resolve, reject) => {
                    Connection.query("SELECT t_acara.id AS idacara, t_acara.nama AS namaacara FROM t_acara WHERE status = 'aktif' ORDER BY id ASC", [selectacara], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                if(part1.length >= 0 && part2.length >= 0 && part3.length >= 0 && part4.length >= 0 && part5.length >= 0 && dataacara.length >= 0){
                    /** kirim data */
                    res.status(200).json({
                        part1, part2, part3, part4, part5,
                        selectacara, dataacara
                    })
                } else {
                    /** error lainnya */
                    throw new Error("Gagal get data skor")
                }
            } else if(cek_acara.length === 0) {
                /** data acara tidak terdaftar */
                throw new Error("Acara tidak terdaftar")
            } else {
                /** error lainnya */
                throw new Error("Gagal cek data acara")
            }

        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Kirim error */
        res.status(400).json({
            message: "Field tidak boleh kosong"
        })
    }
})

/** Route for lupa password */
Router.post('/lupapassword', (req, res) =>{
    try{
        const {email} = req.body;

        if(email) {
            Connection.query("SELECT uemail AS email, id AS id from t_user WHERE uemail = ?", [email], async(error, results) => {
                if(error){
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(results.length == 0){
                    /** email tidak terdaftar */
                    res.status(403).json({
                        message: "Jika email terdaftar, silahkan cek email anda dan ikuti instruksinya"
                    })
                } else if(results.length > 0){
                    /** email terdaftar */
                    res.status(200).json({
                        results
                    })
                } else {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                }
            })
        } else {
            /** field kosong */
            res.status(403).json({
                message: 'Email tidak boleh kosong'
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

module.exports = Router;