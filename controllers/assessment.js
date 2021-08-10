const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
const { resolve } = require("path");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Insert Acara Process */
exports.registrasiJawaban = async (req, res) => {
    const { idacara, iduser, idsoal, radio } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(idacara && iduser && idsoal && radio){
        try{
            /** lakukan terlebih dahulu pengecekkan idacara, iduser dan idsoal */
            /** kemudian lakukan pengecekkan jawaban jika sudah ada jawaban atas ID user, ID soal dan ID acara tsb, */
            /** di lanjutkan ke part selanjutnya */
            /** jika belum ada dilakukan penyimpanan jawaban dan kirim notif jawaban berhasil di simpan */

            const cek_acara = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM t_acara WHERE id = ?", [idacara], (error) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve("true")
                    }
                })
            })

            if(cek_acara === "true"){
                /** jika data acara terdaftar lakukan cek iduser */
                const cek_user = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM t_user WHERE id = ?", [iduser], (error) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve("true")
                        }
                    })
                })

                if(cek_user === "true"){
                    /** jika data user terdaftar lakukan pengecekkan idsoal */
                    var sql_ceksoal = "SELECT id FROM t_soal WHERE id IN (?)";
                    var value_ceksoal = [];
                    for( var i = 0; i < idsoal.length; i++){
                        value_ceksoal.push([idsoal[i]]);
                    }
                    const cek_soal = await new Promise((resolve, reject) => {
                        Connection.query(sql_ceksoal, [value_ceksoal], (error,results) => {
                            if(error) { 
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                    })

                    if(cek_soal.length !== idsoal.length){
                        /** jika data soal tidak terdaftar */
                        throw new Error('Soal tidak terdaftar'); 
                    } else if(cek_soal.length === idsoal.length){
                        /** jika data soal terdaftar sama dengan jumlah soal lakukan pengecekkan */
                        /** apakah user sudah menjawab pertanyaan pada part dan acara terpilih */
                        var sql_cekjawaban = "SELECT id FROM t_answer WHERE idsoal IN (?) AND iduser = ? AND idacara = ?";
                        var value_cekjawaban = [];
                        for( var i = 0; i < idsoal.length; i++){
                            value_cekjawaban.push([idsoal[i]]);
                        }
                        const cek_jawaban = await new Promise((resolve, reject) => {
                            const query_cekjawaban =  Connection.query(sql_cekjawaban, [value_cekjawaban, iduser, idacara], (error,results) => {
                                if(error) { 
                                    reject(error);
                                } else {
                                    resolve(results);
                                }
                            });
                            console.log(query_cekjawaban)
                        })

                        if(cek_jawaban.length === 0){
                            /** user belum menjawab, lakukan penyimpanan */
                            var sql_simpanjawaban = "INSERT INTO t_answer (id, iduser, idsoal, jawab, idacara, date_created, time_created) VALUES ?";
                            var value_simpanjawaban = [];
                            for( var i = 0; i < idsoal.length; i++){
                                value_simpanjawaban.push([null, iduser, idsoal[i], radio[i], idacara, tanggal, waktu]);
                            }
                        
                            const simpan_jawaban = await new Promise((resolve, reject) => {
                                const query_simpanjawaban = Connection.query(sql_simpanjawaban, [value_simpanjawaban], (error) => {
                                    if(error) { 
                                        reject(error);
                                    } else {
                                        resolve("true");
                                    }
                                });
                                console.log(query_simpanjawaban)
                            })

                            if (simpan_jawaban === "true") {
                                /** simpan jawaban */
                                console.log("Berhasil simpan")
                                res.status(201).json({
                                    message: "Jawaban berhasil disimpan, silahkan melanjutkan",
                                    idacara
                                });
                            } else {
                                /** jawaban gagal disimpan */
                                console.log("Gagal simpan")
                                throw new Error('Jawaban gagal disimpan');
                            }
                        } else if(cek_jawaban.length > 0){
                            /** user sudah menjawab, abaikan jawaban terbaru */
                            throw new Error('Silahkan lanjutkan menjawab pertanyaan');
                        } else {
                            /** jika ada error lain */
                            throw new Error('Error, please contact developer');
                        }
                    } else {
                        /** jika data soal tidak terdaftar */
                        throw new Error('Soal tidak terdaftar');    
                    }
                } else {
                    /** jika data user tidak terdaftar */
                    throw new Error('User tidak terdaftar');
                }
            } else {
                /** jika data acara tidak terdaftar */
                throw new Error('Acara tidak terdaftar');
            }

            /** cek pertanyaan V1 */
            // for( var i = 0; i < idsoal.length; i++){
            //     var cek_soal = await new Promise((resolve, reject) => {
            //         Connection.query("SELECT id FROM t_soal WHERE id IN (?)", [idsoal[i]], (error, results)=>{
            //             if(error) { 
            //                 reject(error);
            //             } else {
            //                 resolve(results);
            //             }
            //         })
            //     })
            // }
            
            /** proses penyimpanan jawaban V1*/
            // for( var i = 0; i < idsoal.length; i++){
            //     var simpan_jawaban = await new Promise((resolve, reject) => {
            //         Connection.query("INSERT INTO t_answer SET ?", [{id: null, iduser: iduser, idsoal: idsoal[i], jawab: radio[i], idacara: idacara, date_created: tanggal, time_created: waktu}], (error, results)=>{
            //             if(error) { 
            //                 reject(error);
            //             } else {
            //                 resolve("true");
            //             }
            //         })
            //     })
            // }
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