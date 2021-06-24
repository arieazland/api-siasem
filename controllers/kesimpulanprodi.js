const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Insert Kesimpulan Process */
exports.regConc = async (req, res) => {
    try{
        const { idacara, namaprodi, namafakultas, idpsikolog, kesimpulanprodi } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idacara && namaprodi && namafakultas && idpsikolog && kesimpulanprodi){
            /** cek acara */
            Connection.query("SELECT id FROM t_acara WHERE id = ?",[idacara], async (error, cekacara) => {
                if(error) {
                    /** send error */
                    res.status(500).json({
                        message: error
                    });
                } else if(cekacara.length == 0){
                    /** send error */
                    res.status(403).json({
                        message: "Acara tidak terdaftar"
                    });
                } else if(cekacara.length > 0) {
                    /** cek psikolog */
                    Connection.query("SELECT id FROM t_user WHERE id = ? AND NOT utipe = 'mahasiswa' AND NOT utipe = 'nonaktif'",[idpsikolog], async (error, cekpsikolog) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            });
                        } else if(cekpsikolog.length == 0){
                            /** send error */
                            res.status(403).json({
                                message: "Psikolog tidak terdaftar"
                            });
                        } else if(cekpsikolog.length > 0) {
                            /** cek apakah kesimpulan sudah ada */
                            Connection.query(" SELECT * FROM t_kesimpulan_prodi WHERE idacara = ? AND prodi = ? AND fakultas = ? AND NOT status = 'hapus'", [idacara, namaprodi, namafakultas], async (error, cekkesimpulan) => {
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    });
                                } else if(cekkesimpulan.length > 0) {
                                    /** send error */
                                    res.status(403).json({
                                        message: "Prodi sudah memiliki kesimpulan"
                                    });
                                } else if(cekkesimpulan.length == 0) {
                                    /** peroses insert kesimpulan */
                                    Connection.query("INSERT INTO t_kesimpulan_prodi set ?",{id: null, idacara: idacara, idpsikolog: idpsikolog, fakultas: namafakultas, prodi: namaprodi, kesimpulan: kesimpulanprodi, status: 'aktif', date_created: tanggal, time_created: waktu}, async (error, insertkesimpulan) => {
                                        if(error) {
                                            /** send error */
                                            res.status(500).json({
                                                message: error
                                            });
                                        } else {
                                            /** sukses insert */
                                            res.status(201).json({
                                                message: "Kesimpulan berhasil di simpan",
                                                idacara
                                            });
                                        }
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: "Error, please contact developer"
                                    });
                                }
                            })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: "Error, please contact developer"
                            });
                        }
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: "Error, please contact developer"
                    });
                }
            })
        } else {
            /** field kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            });
        }

    } catch(error) {
        /** send error */
        res.status(500).json({
            message: error
        });
    }
}

/** Edit Kesimpulan Process */
exports.editConc = async (req, res) => {
    try{
        const { idkesimpulan, idacara, idmahasiswa, idpsikolog, kesimpulan } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idkesimpulan && idacara && idmahasiswa && idpsikolog && kesimpulan){
            /** cek acara */
            Connection.query("SELECT id FROM t_acara WHERE id = ?",[idacara], async (error, cekacara) => {
                if(error) {
                    /** send error */
                    res.status(500).json({
                        message: error
                    });
                } else if(cekacara.length == 0){
                    /** send error */
                    res.status(403).json({
                        message: "Acara tidak terdaftar"
                    });
                } else if(cekacara.length > 0) {
                    /** cek mahasiswa */
                    Connection.query("SELECT id FROM t_user WHERE id = ? AND utipe = 'mahasiswa'",[idmahasiswa], async (error, cekmahasiswa) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            });
                        } else if(cekmahasiswa.length == 0){
                            /** send error */
                            res.status(403).json({
                                message: "Mahasiswa tidak terdaftar"
                            });
                        } else if(cekmahasiswa.length > 0) {
                            /** cek psikolog */
                            Connection.query("SELECT id FROM t_user WHERE id = ? AND NOT utipe = 'mahasiswa' AND NOT utipe = 'nonaktif'",[idpsikolog], async (error, cekpsikolog) => {
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    });
                                } else if(cekpsikolog.length == 0){
                                    /** send error */
                                    res.status(403).json({
                                        message: "Psikolog tidak terdaftar"
                                    });
                                } else if(cekpsikolog.length > 0) {
                                    /** cek apakah kesimpulan sudah ada */
                                    Connection.query(" SELECT id FROM t_kesimpulan WHERE idacara = ? AND idmahasiswa = ? AND NOT status = 'hapus' AND id = ?", [idacara, idmahasiswa, idkesimpulan], async (error, cekkesimpulan) => {
                                        if(error) {
                                            /** send error */
                                            res.status(500).json({
                                                message: error
                                            });
                                        } else if(cekkesimpulan.length == 0) {
                                            /** send error */
                                            res.status(403).json({
                                                message: "Data kesimpulan yang akan di ubah tidak ada"
                                            });
                                        } else if(cekkesimpulan.length > 0) {
                                            /** peroses insert kesimpulan */
                                            Connection.query("UPDATE t_kesimpulan set ? WHERE id = ?",[{idacara: idacara, idpsikolog: idpsikolog, idmahasiswa: idmahasiswa, kesimpulan: kesimpulan, status: 'aktif', date_updated: tanggal, time_updated: waktu}, idkesimpulan], async (error, editkesimpulan) => {
                                                if(error) {
                                                    /** send error */
                                                    res.status(500).json({
                                                        message: error
                                                    });
                                                } else {
                                                    /** sukses insert */
                                                    res.status(201).json({
                                                        message: "Kesimpulan berhasil di ubah",
                                                        idacara,
                                                        idmahasiswa
                                                    });
                                                }
                                            })
                                        } else {
                                            /** send error */
                                            res.status(403).json({
                                                message: "Error, please contact developer"
                                            });
                                        }
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: "Error, please contact developer"
                                    });
                                }
                            })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: "Error, please contact developer"
                            });
                        }
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: "Error, please contact developer"
                    });
                }
            })
        } else {
            /** field kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            });
        }

    } catch(error) {
        /** send error */
        res.status(500).json({
            message: error
        });
    }
}

/** Hapus Kesimpulan Process */
exports.deleteConc = async (req, res) => {
    try{
        const { idkesimpulan, idacara, idmahasiswa } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idkesimpulan && idacara && idmahasiswa){
            /** cek acara */
            Connection.query("SELECT id FROM t_acara WHERE id = ?",[idacara], async (error, cekacara) => {
                if(error) {
                    /** send error */
                    res.status(500).json({
                        message: error
                    });
                } else if(cekacara.length == 0){
                    /** send error */
                    res.status(403).json({
                        message: "Acara tidak terdaftar"
                    });
                } else if(cekacara.length > 0) {
                    /** cek mahasiswa */
                    Connection.query("SELECT id FROM t_user WHERE id = ? AND utipe = 'mahasiswa'",[idmahasiswa], async (error, cekmahasiswa) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            });
                        } else if(cekmahasiswa.length == 0){
                            /** send error */
                            res.status(403).json({
                                message: "Mahasiswa tidak terdaftar"
                            });
                        } else if(cekmahasiswa.length > 0) {
                            /** cek apakah kesimpulan sudah ada */
                            Connection.query(" SELECT id FROM t_kesimpulan WHERE idacara = ? AND idmahasiswa = ? AND NOT status = 'hapus' AND id = ?", [idacara, idmahasiswa, idkesimpulan], async (error, cekkesimpulan) => {
                                if(error) {
                                    /** send error */
                                    res.status(500).json({
                                        message: error
                                    });
                                } else if(cekkesimpulan.length == 0) {
                                    /** send error */
                                    res.status(403).json({
                                        message: "Data kesimpulan yang akan di hapus tidak ada"
                                    });
                                } else if(cekkesimpulan.length > 0) {
                                    /** peroses insert kesimpulan */
                                    Connection.query("UPDATE t_kesimpulan set status = 'hapus' WHERE id = ?",[idkesimpulan], async (error, deletekesimpulan) => {
                                        if(error) {
                                            /** send error */
                                            res.status(500).json({
                                                message: error
                                            });
                                        } else {
                                            /** sukses insert */
                                            res.status(201).json({
                                                message: "Kesimpulan berhasil di hapus",
                                                idacara
                                            });
                                        }
                                    })
                                } else {
                                    /** send error */
                                    res.status(403).json({
                                        message: "Error, please contact developer"
                                    });
                                }
                            })
                        } else {
                            /** send error */
                            res.status(403).json({
                                message: "Error, please contact developer"
                            });
                        }
                    })
                } else {
                    /** send error */
                    res.status(403).json({
                        message: "Error, please contact developer"
                    });
                }
            })
        } else {
            /** field kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            });
        }

    } catch(error) {
        /** send error */
        res.status(500).json({
            message: error
        });
    }
}