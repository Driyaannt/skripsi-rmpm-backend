const { db, sequelizeInstances } = require("../../config/sequelize");

const response = require("../tools/response");
const Sequelize = require("sequelize");
const { Op } = require('sequelize');
const moment = require('moment');

const parseDateWithDefaultTime = (value, label = '') => {
    if (!value) return null;

    // Jika sudah Date object dan valid
    if (value instanceof Date && !isNaN(value.getTime())) {
        return value;
    }

    // Jika nilai adalah angka (serial Excel)
    if (typeof value === 'number') {
        // Excel epoch mulai dari 1899-12-30
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const msPerDay = 24 * 60 * 60 * 1000;
        const date = new Date(excelEpoch.getTime() + value * msPerDay);
        return !isNaN(date.getTime()) ? date : null;
    }

    // Parsing format tanggal string
    let parsed = moment(value, ['YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY HH:mm:ss'], true);

    if (!parsed.isValid()) {
        parsed = moment(value, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
        if (parsed.isValid()) {
            parsed.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        }
    }

    if (!parsed.isValid()) {
        console.warn(`Invalid date for '${label}':`, value);
        return null;
    }

    return parsed.toDate();
};

const kedatangan = db.skripsiIncomingRmpm.trKedatangan;

exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 10;
        const offset = (page - 1) * pageSize;
        const location = req.query.location
        const year = req.query.year
        const search = req.query.search
        const suplier = ''

        let filterLocation = {}
        let filterStatus = {}
        let filterSearch = {}
        let filterSuplier = {}
        let filterYear = {}

        if (year) {
            filterYear = {
                tanggal_terima: {
                    [Op.gte]: new Date(`${year}-01-01`),
                    [Op.lte]: new Date(`${year}-12-31`)
                }
            }
        }



        if (suplier) {
            filterSuplier = {
                nama_suplier: {
                    [Op.eq]: suplier
                }
            }
        }

        if (location) {
            filterLocation = {
                location: {
                    [Op.eq]: location
                }
            }
        }
        if (search) {
            filterSearch = {
                [Op.or]: [
                    { nopol: { [Op.like]: `%${search}%` } },
                    { no_sj: { [Op.like]: `%${search}%` } },
                    { no_container: { [Op.like]: `%${search}%` } }

                ]
            };
        }
        const kedatangans = await kedatangan.findAndCountAll(
            {
                where: {
                    ...filterLocation,
                    ...filterYear,
                    ...filterStatus,
                    ...filterSearch,
                    ...filterSuplier
                },
                limit: pageSize,
                offset: offset,
                order: [['id', 'DESC']]
            });
        response(req, res, {
            status: 200,
            data: kedatangans,
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}


exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const kedatanganDetail = await kedatangan.findByPk(id);
        if (!kedatanganDetail) {
            response(req, res, {
                status: 404,
                message: 'Kedatangan not found',
            });
        } else {
            response(req, res, {
                status: 200,
                data: kedatanganDetail,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}


exports.create_kedatangan = async (req, res) => {
    try {
        req.body.createdAt = new Date();
        req.body.updatedAt = new Date();

        const tglSj = new Date(req.body.tgl_sj);
        const tanggalTerima = new Date(req.body.tanggal_terima);

        if (!isNaN(tglSj) && !isNaN(tanggalTerima)) {
            const selisihHari = Math.ceil((tanggalTerima - tglSj) / (1000 * 60 * 60 * 24));

            // Jika tanggal berbeda, masukkan nilai selisih
            if (selisihHari !== 0) {
                req.body.terlambat = selisihHari;
            } else {
                req.body.terlambat = 0; // Bisa juga dihilangkan kalau tidak ingin menyimpan 0
            }
        }

        let kedatangans = await kedatangan.create(req.body);

        response(req, res, {
            status: 200,
            data: kedatangans,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}


exports.deleteKedatangan = async (req, res) => {
    try {
        const id = req.params.id;
        const kedatanganDelete = await kedatangan.findByPk(id);
        if (!kedatanganDelete) {
            response(req, res, {
                status: 404,
                message: 'Kedatangan not found',
            });
        }
    }
    catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

// update pengiriman dan surat
exports.updateKedatangan = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.updatedAt = new Date();

        const tglSj = new Date(req.body.tgl_sj);
        const tanggalTerima = new Date(req.body.tanggal_terima);

        if (!isNaN(tglSj) && !isNaN(tanggalTerima)) {
            const selisihHari = Math.ceil((tanggalTerima - tglSj) / (1000 * 60 * 60 * 24));
            req.body.terlambat = selisihHari !== 0 ? selisihHari : 0;
        }

        const kedatanganUpdate = await kedatangan.findByPk(id);
        if (!kedatanganUpdate) {
            response(req, res, {
                status: 404,
                message: 'Kedatangan not found',
            });
        } else {
            await kedatanganUpdate.update(req.body);
            response(req, res, {
                status: 200,
                data: kedatanganUpdate,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
};


exports.importJson = async (req, res) => {
    try {
        const rows = req.body;

        const mappedRows = rows.map((row, index) => ({
            tanggal_terima: parseDateWithDefaultTime(row.tanggal_terima, `tanggal_terima [row ${index + 1}]`),
            location: row.location || null,
            userId: row.userId || null,
            tujuan_pesanan: row.tujuan_pesanan,
            nopol: row.nopol,
            nama_ekspedisi: row.nama_ekspedisi,
            jenis_kendaraan: row.jenis_kendaraan,
            no_container: row.no_container,
            no_segel: row.no_segel,
            kondisi_segel: row.kondisi_segel,
            ket_kondisi_segel: row.ket_kondisi_segel,
            nama_sopir: row.nama_sopir,
            kondisi_armada: row.kondisi_armada,
            pengganjal_roda: row.pengganjal_roda,
            cek_pest_armada: row.cek_pest_armada || null,
            temuan_pest_armada: row.temuan_pest_armada || null,
            pengiriman_pallet: row.pengiriman_pallet || null,
            kondisi_pallet: row.kondisi_pallet || null,
            ket_kondisi_pallet: row.ket_kondisi_pallet || null,
            cek_pest_material: row.cek_pest_material || null,
            temuan_pest_material: row.temuan_pest_material || null,
            no_sj: row.no_sj || null,
            no_po: row.no_po || null,
            tgl_sj: parseDateWithDefaultTime(row.tgl_sj, `tgl_sj [row ${index + 1}]`),
            nama_suplier: row.nama_suplier || null,
            nama_material: row.nama_material || null,
            nama_variant: row.nama_variant || null,
            jumlah_dikirim: row.jumlah_dikirim || 0,
            jumlah_diterima: row.jumlah_diterima || 0,
            jumlah_ditolak: row.jumlah_ditolak || 0,
            batch_number: row.batch_number || null,
            satuan: row.satuan || null,
            abnormal: row.abnormal || null,
            nama_checker: row.nama_checker || null,
            nama_driver_forklif: row.nama_driver_forklif || null,
            nama_loader: row.nama_loader || null,
            armada_masuk: parseDateWithDefaultTime(row.armada_masuk, `armada_masuk [row ${index + 1}]`),
            armada_keluar: parseDateWithDefaultTime(row.armada_keluar, `armada_keluar [row ${index + 1}]`),
            diisi_oleh: row.diisi_oleh || null,
            verifier: row.verifier || null,
            terlambat: row.terlambat || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Validasi semua tanggal penting
        const invalidRows = mappedRows.filter(r => r.tanggal_terima === null || r.armada_masuk === null || r.armada_keluar === null);
        if (invalidRows.length > 0) {
            return res.status(400).json({
                message: `Beberapa baris memiliki nilai tanggal tidak valid.`,
                total_invalid: invalidRows.length
            });
        }

        await kedatangan.bulkCreate(mappedRows);

        res.status(200).json({ message: 'Data berhasil diimpor' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengimpor data', error: error.message });
    }
};

