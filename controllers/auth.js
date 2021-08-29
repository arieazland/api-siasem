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
    const { emailnim, password } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");

    if(emailnim && password){
        try{
            /** get data user */
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM t_user WHERE uemail = ? OR unim = ?", [emailnim, emailnim], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            if(cek_user.length === 0) {
                /** cek apakah data user kosong */
                /** email/nim salah */
                res.status(401).json({
                    message: 'Email atau NIM atau password anda salah'
                });
            } else if(cek_user.length > 0 && !(await Bcrypt.compare(password, cek_user[0].upass))){
                /** password salah */
                res.status(403).json({
                    message: 'Email atau NIM atau password anda salah'
                });
            } else if (cek_user.length > 0 && cek_user[0].utipe == 'nonaktif'){
                /** user nonaktif */
                res.status(403).json({
                    message: 'User anda sudah di nonaktifkan'
                });
            } else if(cek_user.length > 0 && await Bcrypt.compare(password, cek_user[0].upass) && cek_user[0].utipe != 'nonaktif') {
                /** login sukses */
                res.status(202).json({
                    message: 'Login Berhasil',
                    data: cek_user
                });
            } else {
                res.status(500).json({
                    message: 'Error please contact developer!'
                });
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** username dan password kosong */
        res.status(403).json({
            message: 'Field tidak boleh kosong'
        });
    }
};

/** Admin Register Process */
exports.regAdmin = (req, res) => {
    try{
        const { username, email, nama, phone, tempat_lahir, tanggal_lahir, alamat, password, password2, tipeakun } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(email && nama && password && password2 && tipeakun == 'admin'){
            if(tipeakun === 'admin'){
                Connection.query('SELECT uemail FROM t_user WHERE uemail = ?', [email], async (error, results) => {
                    if(error) { 
                        // throw error;
                        res.status(500).json({
                            message: error
                        });
                    } else if(results.length > 0){
                        /** username sudah dipakai */
                        res.status(403).json({
                            message: "Email sudah terdaftar, silahkan login atau cek kembali email anda",
                        });
                    } else if( password !== password2) {
                        /** password dan password konfirmasi tidak sama */
                        res.status(403).json({
                            message: "Password dan konfirmasi password tidak sama",
                        });
        
                    } else if (results.length == 0){
                        /** Username tersedia */
                        let hashedPassword = await Bcrypt.hash(password, 8);
        
                        Connection.query('INSERT INTO t_user SET ?', {id: null, uname: username, uemail: email, unama: nama, uphone:phone, utempat_lahir: tempat_lahir, utanggal_lahir: tanggal_lahir, ualamat: alamat, upass: hashedPassword, uphone: phone, utipe: "admin", date_created: tanggal, time_created: waktu}, (error, results) => {
                            if(error){
                                res.status(500).json({
                                    message: error
                                });
                            } else {
                                /** Registrasi berhasil dilanjutkan ke login */
                                res.status(201).json({
                                    message: "User account admin berhasil di daftarkan",
                                });
                            }
                        })
                    }
                })
            } else {
                /** Tipe akun bukan admin */
                res.status(403).json({
                    message: "Tipe akun tidak tepat",
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
};

/** Peserta Event Register Process */
exports.regMahasiswa = async (req, res) => {
    const { nim, nama, email, fakultas, prodi, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(nim && nama && fakultas && prodi && email && password && password2){
        try{
            const cek_nim = await new Promise((resolve, reject) => {
                Connection.query('SELECT unim FROM t_user WHERE unim = ?', [nim], async (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if( prodi.includes("S2") || prodi.includes("MAGISTER") || prodi.includes("s2") || prodi.includes("Magister") || prodi.includes("magister") || prodi.includes("S3") || prodi.includes("s3") ) {
                /** Prodi S2 tidak diperkenankan */
                res.status(403).json({
                    message: "Jenjang pendidikan anda diatas S1, untuk saat ini SAPA diperuntukkan bagi mahasiswa jenjang pendidikan S1 dan D3",
                });
            } else if( cek_nim.length > 0 ){
                /** jika nim sudah terdaftar */
                res.status(403).json({
                    message: "NIM sudah terdaftar, silahkan login atau cek kembali NIM anda",
                });
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(403).json({
                    message: "Password dan konfirmasi password tidak sama",
                });
            } else if( cek_nim.length === 0 ) {
                /** nim blm terdaftar */
                /** perubahan ke fakultas kesehatan masyarakat jika prodi: ILMU KESEHATAN MASYARAKAT (S1), ILMU KESEHATAN MASYARAKAT (S1 DARI D3), GIZI (S1), KESEHATAN LINGKUNGAN (S1) */
                if( prodi === 'ILMU KESEHATAN MASYARAKAT (S1)' || prodi === 'ILMU KESEHATAN MASYARAKAT (S1 DARI D3)' || prodi === 'GIZI (S1)' || prodi === 'KESEHATAN LINGKUNGAN (S1)' ){
                    var fakultas_ubah = 'KESEHATAN MASYARAKAT'
                } else {
                    var fakultas_ubah = fakultas
                }

                /** hash password */
                let hashedPassword = await Bcrypt.hash(password, 8);

                /** lakukan penyimpanan data user*/
                const simpan_data = await new Promise((resolve, reject) => {
                    Connection.query('INSERT INTO t_user SET ?', {id: null, unim: nim, unama: nama, uemail: email, upass: hashedPassword, utipe: "mahasiswa", ufakultas: fakultas_ubah, uprodi: prodi, date_created: tanggal, time_created: waktu}, 
                        (error) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve("true")
                        }
                    })
                })

                if(simpan_data === "true"){
                    /** Registrasi berhasil dilanjutkan ke login */
                    res.status(201).json({
                        message: "User account berhasil di daftarkan, silahkan login",
                    });
                } else {
                    /** Registrasi gagal */
                    res.status(500).json({
                        message: "Registrasi mahasiswa baru gagal!",
                    });
                }
            }
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

/** Psikolog Register Process */
exports.regPsikolog = (req, res) => {
    try{
        const { username, email, nama, phone, tempat_lahir, tanggal_lahir, alamat, password, password2, tipeakun } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(email && nama && password && password2 && tipeakun){
            if(tipeakun === 'psikolog'){
                Connection.query('SELECT uemail FROM t_user WHERE uemail = ?', [email], async (error, results) => {
                    if(error) { 
                        // throw error;
                        res.status(500).json({
                            message: error
                        });
                    } else if(results.length > 0){
                        /** username sudah dipakai */
                        res.status(403).json({
                            message: "Email sudah terdaftar, silahkan login atau cek kembali email anda",
                        });
                        
                    } else if( password !== password2) {
                        /** password dan password konfirmasi tidak sama */
                        res.status(403).json({
                            message: "Password dan konfirmasi password tidak sama",
                        });
    
                    } else if (results.length == 0){
                        /** Username tersedia */
                        let hashedPassword = await Bcrypt.hash(password, 8);
    
                        Connection.query('INSERT INTO t_user SET ?', {id: null, uname: username, uemail: email, unama: nama, uphone:phone, utempat_lahir: tempat_lahir, utanggal_lahir: tanggal_lahir, ualamat: alamat, upass: hashedPassword, uphone: phone, utipe: "psikolog", date_created: tanggal, time_created: waktu}, (error) => {
                            if(error){
                                res.status(500).json({
                                    message: error
                                });
                            } else {
                                /** Registrasi berhasil  */
                                res.status(201).json({
                                    message: "User account psikolog berhasil di daftarkan",
                                });
                            }
                        })
                    }
                })
            } else {
                /** Tipe akun bukan admin */
                res.status(403).json({
                    message: "Tipe akun tidak tepat",
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
};

/** Edit Account Process */
exports.editUser = (req, res) => {
    try{
        const { id, username, email, nama, telepon, tempatlahir, tanggallahir, alamat, tipe} = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(id && email && nama && tipe){
            if(tipe === 'admin' || tipe === 'psikolog'){
                Connection.query('SELECT id FROM t_user WHERE id = ?', [id], async (error, resultsid) => {
                    if(error){
                        res.status(500).json({
                            message: error
                        });
                    } else if(resultsid.length == 0) {
                        /** id user tidak ada */
                        res.status(403).json({
                            message: "User tidak terdaftar",
                        });
                    } else if(resultsid.length > 0) {
                        Connection.query('SELECT uemail FROM t_user WHERE uemail = ? AND id <> ?', [email, id], async (error, results) => {
                            if(error) { 
                                // throw error;
                                res.status(500).json({
                                    message: error
                                });
                            } else if(results.length > 0){
                                /** username sudah dipakai */
                                res.status(403).json({
                                    message: "Email sudah terdaftar silahkan gunakan email yang lain",
                                });
                
                            } else if (results.length == 0){
                                /** Username tersedia */
                
                                Connection.query('UPDATE t_user SET ? WHERE id = ?', [{uname: username, uemail: email, unama: nama, uphone: telepon, utempat_lahir: tempatlahir, utanggal_lahir: tanggallahir, ualamat: alamat, utipe: tipe, date_updated: tanggal, time_updated: waktu}, id], (error, results) => {
                                    if(error){
                                        res.status(500).json({
                                            message: error
                                        });
                                    } else {
                                        /** Registrasi berhasil dilanjutkan ke login */
                                        res.status(200).json({
                                            message: "Data user berhasil di ubah",
                                        });
                                    }
                                })
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
                res.status(403).json({
                    message: "Tipe akun salah"
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
};

/** Delete Account Process */
exports.deleteUser = (req, res) => {
    try{
        const { id } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");
        
        if(id){
            Connection.query('SELECT id FROM t_user WHERE id = ?', [id], async (error, resultsid) => {
                if(error){
                    res.status(500).json({
                        message: error
                    });
                } else if(resultsid.length == 0) {
                    /** id user tidak ada */
                    res.status(403).json({
                        message: "User tidak terdaftar",
                    });
                } else if(resultsid.length >0) {
                    Connection.query('UPDATE t_user SET ? WHERE id = ? ', [{utipe: 'nonaktif', date_updated: tanggal, time_updated: waktu}, id], async (error, results) => {
                        if(error) { 
                            // throw error;
                            res.status(500).json({
                                message: error
                            });
                        } else {
                            /** username dinonaktifkan */
                            res.status(200).json({
                                message: "User account berhasil di hapus",
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
};

/** Reset Password Process */
exports.resetPassword = (req, res) => {
    try{
        const { id, password, password2 } = req.body;

        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(id && password && password2){
            if(password == password2){
                Connection.query("SELECT * FROM t_user WHERE id = ?", [id], async(error, cekpeserta) => {
                    if(error){
                        res.status(500).json({
                            message: error
                        });
                    } else if(cekpeserta.length == 0){
                        /** Peserta tidak terdaftar */
                        res.status(403).json({
                            message: "Peserta tidak terdaftar",
                        });
                    } else if(cekpeserta.length > 0){
                        let hashedPassword = await Bcrypt.hash(password, 8);
                        Connection.query("UPDATE t_user SET ? WHERE id = ?", [{upass: hashedPassword, date_updated: tanggal, time_updated: waktu}, id], async (error, results) => {
                            if(error){
                                res.status(500).json({
                                    message: error
                                });
                            } else {
                                res.status(200).json({
                                    message: "Reset password berhasil, silahkan login"
                                });
                            }
                        })
                    } else {
                        res.status(403).json({
                            message: "Error, please contact developer"
                        });
                    }
                })
            } else {
                /** Password dan konfirmasi password tidak sama */
                res.status(403).json({
                    message: "Password dan konfirmasi password tidak sama",
                });
            }
        } else {
            /** Field tidak boleh kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong",
            });
        }
    } catch(error){
        res.status(500).json({
            message: error
        });
    }
};

/** Admin Reset Password Process */
exports.adminresetPassword = (req, res) => {
    try{
        const { id, password, password2 } = req.body;

        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(id && password && password2){
            if(password == password2){
                Connection.query("SELECT * FROM t_user WHERE id = ?", [id], async(error, cekpeserta) => {
                    if(error){
                        res.status(500).json({
                            message: error
                        });
                    } else if(cekpeserta.length == 0){
                        /** Peserta tidak terdaftar */
                        res.status(403).json({
                            message: "Peserta tidak terdaftar",
                        });
                    } else if(cekpeserta.length > 0){
                        let hashedPassword = await Bcrypt.hash(password, 8);
                        Connection.query("UPDATE t_user SET ? WHERE id = ?", [{upass: hashedPassword, date_updated: tanggal, time_updated: waktu}, id], async (error, results) => {
                            if(error){
                                res.status(500).json({
                                    message: error
                                });
                            } else {
                                res.status(200).json({
                                    message: "Reset password berhasil"
                                });
                            }
                        })
                    } else {
                        res.status(403).json({
                            message: "Error, please contact developer"
                        });
                    }
                })
            } else {
                /** Password dan konfirmasi password tidak sama */
                res.status(403).json({
                    message: "Password dan konfirmasi password tidak sama",
                });
            }
        } else {
            /** Field tidak boleh kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong",
            });
        }
    } catch(error){
        res.status(500).json({
            message: error
        });
    }
};