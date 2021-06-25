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

/** Route for part */
Router.post('/listpertanyaan', (req, res) =>{
    try{
        const { selectacara, idu } = req.body;

        if(selectacara && idu){
            /** Cek apakah user sudah ada jawaban di part 1 */
            Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 1 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser GROUP BY t_part.id ', [idu] ,async (error, cekjawaban1) => {
                if(error){
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(cekjawaban1.length > 0){
                    /** jika sudah ada jawaban part 1, cek jawaban di part 2 */
                    Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 2 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban2) => {
                        if(error){
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(cekjawaban2.length > 0){
                            /** jika sudah ada jawaban part 2, cek jawaban di part 3 */
                            Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 3 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban3) => {
                                if(error){
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if (cekjawaban3.length > 0){
                                    /** jika sudah ada jawaban part 3, cek jawaban di part 4 */
                                    Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 4 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban4) => {
                                        if(error){
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else if(cekjawaban4.length > 0){
                                            /** jika sudah ada jawaban part 4, cek jawaban di part 5 */
                                            Connection.query('select t_user.unim, t_user.unama, t_part.id, t_part.nama from t_answer, t_part, t_soal, t_user where iduser = ? AND t_part.id = 5 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND t_user.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectacara] ,async (error, cekjawaban5) => {
                                                if(error){
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    })
                                                } else if(cekjawaban5.length > 0){
                                                    /** jika sudah ada jawaban part 5, kirim notif assessment selesai */
                                                    /** cek ketersediaan acara */
                                                    Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
                                                        if(error){
                                                           /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            }) 
                                                        } else if(resultsidacara.length > 0) {
                                                            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
                                                                if(error) {
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    }) 
                                                                } else if(dataacara.length >= 0) {
                                                                    res.status(200).json({
                                                                        selectacara,
                                                                        dataacara,
                                                                        message: 'Assessment selesai, silahkan logout. Terima kasih'
                                                                    })
                                                                } else {
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: 'Error, please contact developer'
                                                                    }) 
                                                                }
                                                            })
                                                        } else if(resultsidacara.length == 0) {
                                                            res.status(500).json({
                                                                message: 'Acara tidak terdaftar'
                                                            }) 
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            }) 
                                                        }
                                                    })
                                                } else if(cekjawaban5.length == 0){
                                                    /** jika belum ada jawaban di part 5 tampilkan pertanyaan part 5 */
                                                    Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 5 ORDER BY t_soal.id ASC', async (error, results) => {
                                                        if(error){
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            })
                                                        } else if(results.length >= 0){
                                                            /** cek ketersediaan acara */
                                                            Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
                                                                if(error){
                                                                   /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    }) 
                                                                } else if(resultsidacara.length > 0) {
                                                                    Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
                                                                        if(error) {
                                                                            /** Kirim error */
                                                                            res.status(500).json({
                                                                                message: error
                                                                            }) 
                                                                        } else if(dataacara.length >= 0) {
                                                                            res.status(200).json({
                                                                                results,
                                                                                selectacara,
                                                                                dataacara,
                                                                                partpertanyaan : 5
                                                                            })
                                                                        } else {
                                                                            /** Kirim error */
                                                                            res.status(500).json({
                                                                                message: 'Error, please contact developer'
                                                                            }) 
                                                                        }
                                                                    })
                                                                } else if(resultsidacara.length == 0) {
                                                                    res.status(500).json({
                                                                        message: 'Acara tidak terdaftar'
                                                                    }) 
                                                                } else {
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    }) 
                                                                }
                                                            })
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: 'Error, please contact developer'
                                                            }) 
                                                        }
                                                    })
                                                } else {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: 'Error, please contact developer'
                                                    }) 
                                                }
                                            })
                                        } else if(cekjawaban4.length == 0){
                                            /** jika belum ada jawaban di part 4 tampilkan pertanyaan part 4 */
                                            Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 4 ORDER BY t_soal.id ASC', async (error, results) => {
                                                if(error){
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    })
                                                } else if(results.length >= 0){
                                                    /** cek ketersediaan acara */
                                                    Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
                                                        if(error){
                                                           /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            }) 
                                                        } else if(resultsidacara.length > 0) {
                                                            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
                                                                if(error) {
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: error
                                                                    }) 
                                                                } else if(dataacara.length >= 0) {
                                                                    res.status(200).json({
                                                                        results,
                                                                        selectacara,
                                                                        dataacara,
                                                                        partpertanyaan : 4
                                                                    })
                                                                } else {
                                                                    /** Kirim error */
                                                                    res.status(500).json({
                                                                        message: 'Error, please contact developer'
                                                                    }) 
                                                                }
                                                            })
                                                        } else if(resultsidacara.length == 0) {
                                                            res.status(500).json({
                                                                message: 'Acara tidak terdaftar'
                                                            }) 
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            }) 
                                                        }
                                                    })
                                                } else {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: 'Error, please contact developer'
                                                    }) 
                                                }
                                            })
                                        } else {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: 'Error, please contact developer'
                                            }) 
                                        }
                                    })
                                } else if(cekjawaban3.length == 0){
                                    /** jika belum ada jawaban di part 3 tampilkan pertanyaan part 3 */
                                    Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 3 ORDER BY t_soal.id ASC', async (error, results) => {
                                        if(error){
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else if(results.length >= 0){
                                            /** cek ketersediaan acara */
                                            Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
                                                if(error){
                                                   /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    }) 
                                                } else if(resultsidacara.length > 0) {
                                                    Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
                                                        if(error) {
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: error
                                                            }) 
                                                        } else if(dataacara.length >= 0) {
                                                            res.status(200).json({
                                                                results,
                                                                selectacara,
                                                                dataacara,
                                                                partpertanyaan : 3
                                                            })
                                                        } else {
                                                            /** Kirim error */
                                                            res.status(500).json({
                                                                message: 'Error, please contact developer'
                                                            }) 
                                                        }
                                                    })
                                                } else if(resultsidacara.length == 0) {
                                                    res.status(500).json({
                                                        message: 'Acara tidak terdaftar'
                                                    }) 
                                                } else {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    }) 
                                                }
                                            })
                                        } else {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: 'Error, please contact developer'
                                            }) 
                                        }
                                    })
                                } else {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: 'Error, please contact developer'
                                    }) 
                                }
                            })
                        } else if(cekjawaban2.length == 0) {
                            /** jika belum ada jawaban di part 2 tampilkan pertanyaan part 2 */
                            Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 2 ORDER BY t_soal.id ASC', async (error, results) => {
                                if(error){
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    })
                                } else if(results.length >= 0){
                                    /** cek ketersediaan acara */
                                    Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
                                        if(error){
                                           /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            }) 
                                        } else if(resultsidacara.length > 0) {
                                            Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
                                                if(error) {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: error
                                                    }) 
                                                } else if(dataacara.length >= 0) {
                                                    res.status(200).json({
                                                        results,
                                                        selectacara,
                                                        dataacara,
                                                        partpertanyaan : 2
                                                    })
                                                } else {
                                                    /** Kirim error */
                                                    res.status(500).json({
                                                        message: 'Error, please contact developer'
                                                    }) 
                                                }
                                            })
                                        } else if(resultsidacara.length == 0) {
                                            res.status(500).json({
                                                message: 'Acara tidak terdaftar'
                                            }) 
                                        } else {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            }) 
                                        }
                                    })
                                } else {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: 'Error, please contact developer'
                                    }) 
                                }
                            })
                        } else {
                            /** Kirim error */
                            res.status(500).json({
                                message: 'Error, please contact developer'
                            }) 
                        }
                    })
                } else if(cekjawaban1.length == 0) {
                    /** jika belum ada jawaban di part 1 tampilkan pertanyaan part 1 */
                    Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 1 ORDER BY t_soal.id ASC', async (error, results) => {
                        if(error){
                            /** Kirim error */
                            res.status(500).json({
                                message: error
                            })
                        } else if(results.length >= 0){
                            /** cek ketersediaan acara */
                            Connection.query('SELECT id FROM t_acara where id = ?', [selectacara], async (error, resultsidacara) => {
                                if(error){
                                   /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    }) 
                                } else if(resultsidacara.length > 0) {
                                    Connection.query("SELECT * FROM t_acara WHERE status = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, dataacara) => {
                                        if(error) {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: error
                                            }) 
                                        } else if(dataacara.length >= 0) {
                                            res.status(200).json({
                                                results,
                                                selectacara,
                                                dataacara,
                                                partpertanyaan : 1
                                            })
                                        } else {
                                            /** Kirim error */
                                            res.status(500).json({
                                                message: 'Error, please contact developer'
                                            }) 
                                        }
                                    })
                                } else if(resultsidacara.length == 0) {
                                    res.status(500).json({
                                        message: 'Acara tidak terdaftar'
                                    }) 
                                } else {
                                    /** Kirim error */
                                    res.status(500).json({
                                        message: error
                                    }) 
                                }
                            })
                        } else {
                            /** Kirim error */
                            res.status(500).json({
                                message: 'Error, please contact developer'
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
});

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

module.exports = Router;