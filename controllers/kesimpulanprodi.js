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
        const { idkesimpulan, idacara, idprodi, idpsikolog, kesimpulan } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idkesimpulan && idacara && idprodi && idpsikolog && kesimpulan){
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
                    /** cek prodi */
                    Connection.query("SELECT view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.idacara = ? AND view_total_skor_mhs_acara.prodi IN (SELECT prodi FROM t_kesimpulan_prodi WHERE status = 'aktif') GROUP BY view_total_skor_mhs_acara.fakultas, view_total_skor_mhs_acara.prodi",[idacara], async (error, cekprodi) => {
                        if(error) {
                            /** send error */
                            res.status(500).json({
                                message: error
                            });
                        } else if(cekprodi.length == 0){
                            /** send error */
                            res.status(403).json({
                                message: "Prodi tidak terdaftar"
                            });
                        } else if(cekprodi.length > 0) {
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
                                    Connection.query(" SELECT id FROM t_kesimpulan_prodi WHERE idacara = ? AND prodi = ? AND NOT status = 'hapus' AND id = ?", [idacara, idprodi, idkesimpulan], async (error, cekkesimpulan) => {
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
                                            Connection.query("UPDATE t_kesimpulan_prodi set ? WHERE id = ?",[{idpsikolog: idpsikolog, kesimpulan: kesimpulan, status: 'aktif', date_updated: tanggal, time_updated: waktu}, idkesimpulan], async (error, editkesimpulan) => {
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
                                                        idprodi
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
        const { idkesimpulan, idacara, idprodi } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss");

        if(idkesimpulan && idacara && idprodi){
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
                    /** cek apakah kesimpulan ada */
                    Connection.query(" SELECT id FROM t_kesimpulan_prodi WHERE idacara = ? AND prodi = ? AND NOT status = 'hapus' AND id = ?", [idacara, idprodi, idkesimpulan], async (error, cekkesimpulan) => {
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
                            Connection.query("UPDATE t_kesimpulan_prodi set status = 'hapus' WHERE id = ?",[idkesimpulan], async (error, deletekesimpulan) => {
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