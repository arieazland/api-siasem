const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Login Process */
exports.login = async (req, res) => {
    try {
        const { emailnim, password } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(emailnim && password){
            Connection.query('SELECT * FROM t_user WHERE uemail = ? OR unim = ?', [emailnim, emailnim], async (error, results) =>{
                if(error){
                    // throw error;
                    res.status(500).json({
                        message: error
                    });
                } else if(results.length == 0){
                    /** email salah */
                    res.status(401).json({
                        message: 'Email atau NIM atau password anda salah'
                    });
                } else if(results.length > 0 && !(await Bcrypt.compare(password, results[0].upass))){
                    /** password salah */
                    res.status(401).json({
                        message: 'Email atau NIM atau password anda salah'
                    });
                } else if (results.length > 0 && results[0].utipe == 'nonaktif'){
                    /** user nonaktif */
                    res.status(401).json({
                        message: 'User anda sudah di nonaktifkan'
                    });
                } else if(results.length > 0 && await Bcrypt.compare(password, results[0].upass) && results[0].utipe != 'nonaktif') {
                    /** login sukses */
                    res.status(200).json({
                        message: 'Login Berhasil',
                        data: results
                    });
                } else {
                    res.status(500).json({
                        message: 'Error please contact developer!'
                    });
                }
            });
        } else {
            /** username dan password kosong */
            res.status(500).json({
                message: 'Field tidak boleh kosong'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
};

/** Admin Register Process */
exports.regAdmin = (req, res) => {
    const { email, nama, phone, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(email && nama && password && password2){
        Connection.query('SELECT uemail FROM t_user WHERE uemail = ?', [email], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "Email sudah terdaftar, silahkan login",
                });
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "Password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                let hashedPassword = await Bcrypt.hash(password, 8);

                Connection.query('INSERT INTO t_user SET ?', {id: null, uemail: email, unama: nama, 
                    upass: hashedPassword, uphone: phone, utipe: "admin", date_created: tanggal, time_created: waktu}, 
                    (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "User account berhasil di daftarkan",
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Peserta Event Register Process */
exports.regMahasiswa = (req, res) => {
    const { nim, nama, fakultas, prodi, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(nim && nama && fakultas && prodi && password && password2){
        Connection.query('SELECT unim FROM t_user WHERE unim = ?', [nim], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "NIM sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "Password dan konfirmasi password tidak sama",
                });
            } else if (results.length == 0){
                /** Username tersedia */
                let hashedPassword = await Bcrypt.hash(password, 8);

                Connection.query('INSERT INTO t_user SET ?', {id: null, unim: nim, unama: nama, upass: hashedPassword, utipe: "mahasiswa", ufakultas: fakultas, uprodi: prodi, date_created: tanggal, time_created: waktu}, 
                    (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "User account berhasil di daftarkan, silahkan login",
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Psikolog Register Process */
exports.registerPsikolog = (req, res) => {
    // const { email, nama, password, password2 } = req.body;
    // var tanggal = Moment().format("YYYY-MM-DD");
    // var waktu = Moment().format("HH:mm:ss");
    
    // if(email && nama && password && password2){
    //     Connection.query('SELECT email FROM icare_account WHERE email = ?', [email], async (error, results) => {
    //         if(error) { 
    //             // throw error;
    //             res.status(500).json({
    //                 message: error
    //             });
    //         } else if(results.length > 0){
    //             /** username sudah dipakai */
    //             res.status(500).json({
    //                 message: "Email sudah terdaftar, silahkan login",
    //             });
                
    //         } else if( password !== password2) {
    //             /** password dan password konfirmasi tidak sama */
    //             res.status(500).json({
    //                 message: "Password dan konfirmasi password tidak sama",
    //             });

    //         } else if (results.length == 0){
    //             /** Username tersedia */
    //             let hashedPassword = await Bcrypt.hash(password, 8);

    //             Connection.query('INSERT INTO icare_account SET ?', {id: null, email: email, nama: nama, 
    //                 password: hashedPassword, account_type: "psikologis", date_created: tanggal, time_created: waktu}, 
    //                 (error) => {
    //                 if(error){
    //                     console.log(error)
    //                 } else {
    //                     /** Registrasi berhasil  */
    //                     Connection.query("SELECT * FROM icare_account", async (error, results) =>{
    //                         if(error){ 
    //                             throw error; 
    //                         } else if(results.length >= 0){
    //                             /** Kirim data user */
    //                             res.status(201).json({
    //                                 message: "User account berhasil di daftarkan",
    //                             });
    //                         }
    //                     });
    //                 }
    //             })
    //         }
    //     })
    // } else {
    //     /** Field tidak boleh kosong */
    //     res.status(500).json({
    //         message: "Field tidak boleh kosong",
    //     });
    // }
};

/** Edit Account Process */
exports.edit = (req, res) => {
    // const { id, email, nama, } = req.body;
    // var tanggal = Moment().format("YYYY-MM-DD");
    // var waktu = Moment().format("HH:mm:ss");
    
    // if(id && email && nama){
    //     Connection.query('SELECT email FROM icare_account WHERE email = ? AND id <> ?', [email, id], async (error, results) => {
    //         if(error) { 
    //             // throw error;
    //             res.status(500).json({
    //                 message: error
    //             });
    //         } else if(results.length > 0){
    //             /** username sudah dipakai */
    //             res.status(500).json({
    //                 message: "Email sudah terdaftar silahkan gunakan email yang lain",
    //             });

    //         } else if (results.length == 0){
    //             /** Username tersedia */

    //             Connection.query('UPDATE icare_account SET ? WHERE id = ?', [{email: email, nama: nama, 
    //                 date_updated: tanggal, time_updated: waktu}, id], (error, results) => {
    //                 if(error){
    //                     console.log(error)
    //                 } else {
    //                     /** Registrasi berhasil dilanjutkan ke login */
    //                     res.status(201).json({
    //                         message: "Data user berhasil di ubah",
    //                     });
    //                 }
    //             })
    //         }
    //     })
    // } else {
    //     /** Field tidak boleh kosong */
    //     res.status(500).json({
    //         message: "Field tidak boleh kosong",
    //     });
    // }
};

/** Delete Account Process */
exports.delete = (req, res) => {
    // const { id } = req.body;
    // var tanggal = Moment().format("YYYY-MM-DD");
    // var waktu = Moment().format("HH:mm:ss");
    
    // if(id){
    //     Connection.query('UPDATE icare_account SET ? WHERE id = ? ', [{account_type: 'nonaktif', date_updated: tanggal, 
    //     time_updated: waktu}, id], async (error, results) => {
    //         if(error) { 
    //             // throw error;
    //             res.status(500).json({
    //                 message: error
    //             });
    //         } else {
    //             /** username dinonaktifkan */
    //             res.status(201).json({
    //                 message: "User account berhasil di hapus",
    //             });
    //         }
    //     })
    // } else {
    //     /** Field tidak boleh kosong */
    //     res.status(500).json({
    //         message: "Field tidak boleh kosong",
    //     });
    // }
};