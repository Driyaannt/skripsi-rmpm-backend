const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { Op, fn, col, literal, Sequelize } = require('sequelize');
const pengiriman = db.skripsiIncomingRmpm.trPengiriman;
const kedatangan = db.skripsiIncomingRmpm.trKedatangan;
const armada = db.skripsiIncomingRmpm.mstJenisArmada;
const surat = db.skripsiIncomingRmpm.trSurat;
const suratKedatangan = db.skripsiIncomingRmpm.trSuratKedatangan;


exports.getPengirimanKedatangan = async (req, res) => {
    try {
        const location = req.query.location;
        const armada = req.query.armada;
        const year = req.query.year || 2024;
        let filterLocation = {};
        let filterArmada = {};

        if (location != 'all') {
            filterLocation = {
                location: {
                    [Op.eq]: location
                }
            };
        }

        if (armada != 'all') {
            filterArmada = {
                jenis_kendaraan: {
                    [Op.eq]: armada
                }
            };
        }

        const pengirimanPerBulan = await pengiriman.findAll({
            where: {
                [Op.and]: [
                    filterLocation,
                    filterArmada,
                    [Sequelize.where(fn('YEAR', col('tanggal_kirim')), year)]
                ]
            },
            attributes: [
                [fn('MONTH', col('tanggal_kirim')), 'bulan'],
                [fn('COUNT', col('id')), 'jumlahPengiriman']
            ],
            group: [literal('bulan')],
            order: [[literal('bulan'), 'ASC']]
        });

        const kedatanganPerBulan = await kedatangan.findAll({
            where: {
                [Op.and]: [
                    filterLocation,
                    filterArmada,
                    [Sequelize.where(fn('YEAR', col('tanggal_terima')), year)]
                ]
            },
            attributes: [
                [fn('MONTH', col('tanggal_terima')), 'bulan'],
                [fn('COUNT', col('id')), 'jumlahKedatangan']
            ],
            group: [literal('bulan')],
            order: [[literal('bulan'), 'ASC']]
        });

        // Calculate totals for the year
        const totalPengiriman = pengirimanPerBulan.reduce((total, item) => total + parseInt(item.dataValues.jumlahPengiriman, 10), 0);
        const totalKedatangan = kedatanganPerBulan.reduce((total, item) => total + parseInt(item.dataValues.jumlahKedatangan, 10), 0);

        response(req, res, {
            status: 200,
            data: {
                pengirimanPerBulan,
                kedatanganPerBulan,
                totalPengiriman,
                totalKedatangan
            },
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
};


exports.getDataMaterial = async (req, res) => {
    try {
        const location = req.query.location;
        const nama_material = req.query.nama_material || 'undefined';
        const year = req.query.year || 2024;
        let filterLocation = {};
        let filterMaterial = {};

        if (location) {
            filterLocation = {
                location: {
                    [Op.eq]: location
                }
            };
        }

        if (nama_material) {
            filterMaterial = {
                nama_material: {
                    [Op.eq]: nama_material
                }
            };
        }

        const pengirimanData = await pengiriman.findAll({
            include: [{
                model: surat,
                as: 'surats',
                where: filterMaterial,
                required: true
            }],
            where: {
                [Op.and]: [
                    filterLocation,
                    Sequelize.where(fn('YEAR', col('tanggal_kirim')), year)
                ]
            },
            attributes: [
                [fn('MONTH', col('tanggal_kirim')), 'bulan'],
                [fn('COUNT', col('trPengiriman.id')), 'jumlahPengiriman']
            ],
            group: [literal('bulan')],
            order: [[literal('bulan'), 'ASC']]
        });

        const kedatanganData = await kedatangan.findAll({
            include: [{
                model: suratKedatangan,
                as: 'surats',
                where: filterMaterial,
                required: true
            }],
            where: {
                [Op.and]: [
                    filterLocation,
                    Sequelize.where(fn('YEAR', col('tanggal_terima')), year)
                ]
            },
            attributes: [
                [fn('MONTH', col('tanggal_terima')), 'bulan'],
                [fn('COUNT', col('trKedatangan.id')), 'jumlahKedatangan']
            ],
            group: [literal('bulan')],
            order: [[literal('bulan'), 'ASC']]
        });

        // Merging pengiriman and kedatangan data by month
        const dataPerBulan = {};

        pengirimanData.forEach(item => {
            const bulan = item.dataValues.bulan;
            if (!dataPerBulan[bulan]) {
                dataPerBulan[bulan] = { bulan, jumlahPengiriman: 0, jumlahKedatangan: 0 };
            }
            dataPerBulan[bulan].jumlahPengiriman = item.dataValues.jumlahPengiriman;
        });

        kedatanganData.forEach(item => {
            const bulan = item.dataValues.bulan;
            if (!dataPerBulan[bulan]) {
                dataPerBulan[bulan] = { bulan, jumlahPengiriman: 0, jumlahKedatangan: 0 };
            }
            dataPerBulan[bulan].jumlahKedatangan = item.dataValues.jumlahKedatangan;
        });

        response(req, res, {
            status: 200,
            data: Object.values(dataPerBulan),
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
};

exports.getDataSuplier = async (req, res) => {
    try {
        const location = req.query.location;
        const nama_suplier = req.query.nama_suplier || 'undefined';
        const year = req.query.year || 2024;
        let filterLocation = {};
        let filterSuplier = {};

        if (location) {
            filterLocation = {
                location: {
                    [Op.eq]: location
                }
            };
        }

        if (nama_suplier) {
            filterSuplier = {
                nama_suplier: {
                    [Op.eq]: nama_suplier
                }
            };
        }

        const pengirimanData = await pengiriman.findAll({
            include: [{
                model: surat,
                as: 'surats',
                where: filterSuplier,
                required: true
            }],
            where: {
                [Op.and]: [
                    filterLocation,
                    Sequelize.where(fn('YEAR', col('tanggal_kirim')), year)
                ]
            },
            attributes: [
                [fn('MONTH', col('tanggal_kirim')), 'bulan'],
                [fn('COUNT', col('trPengiriman.id')), 'jumlahPengiriman']
            ],
            group: [literal('bulan')],
            order: [[literal('bulan'), 'ASC']]
        });

        const kedatanganData = await kedatangan.findAll({
            include: [{
                model: suratKedatangan,
                as: 'surats',
                where: filterSuplier,
                required: true
            }],
            where: {
                [Op.and]: [
                    filterLocation,
                    Sequelize.where(fn('YEAR', col('tanggal_terima')), year)
                ]
            },
            attributes: [
                [fn('MONTH', col('tanggal_terima')), 'bulan'],
                [fn('COUNT', col('trKedatangan.id')), 'jumlahKedatangan']
            ],
            group: [literal('bulan')],
            order: [[literal('bulan'), 'ASC']]
        });

        // Merging pengiriman and kedatangan data by month
        const dataPerBulan = {};

        pengirimanData.forEach(item => {
            const bulan = item.dataValues.bulan;
            if (!dataPerBulan[bulan]) {
                dataPerBulan[bulan] = { bulan, jumlahPengiriman: 0, jumlahKedatangan: 0 };
            }
            dataPerBulan[bulan].jumlahPengiriman = item.dataValues.jumlahPengiriman;
        });

        kedatanganData.forEach(item => {
            const bulan = item.dataValues.bulan;
            if (!dataPerBulan[bulan]) {
                dataPerBulan[bulan] = { bulan, jumlahPengiriman: 0, jumlahKedatangan: 0 };
            }
            dataPerBulan[bulan].jumlahKedatangan = item.dataValues.jumlahKedatangan;
        });

        response(req, res, {
            status: 200,
            data: Object.values(dataPerBulan),
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
};


exports.getYear = async (req, res) => {
    try {
        const years = await kedatangan.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.fn('YEAR', Sequelize.col('tanggal_terima'))), 'year']
            ],
            order: [
                [Sequelize.fn('YEAR', Sequelize.col('tanggal_terima')), 'DESC']
            ],
            raw: true, // Ensure raw mode to get plain array data
        });

        const yearList = years.map(item => item.year); // Extract 'year' values into a plain array

        res.status(200).json({
            status: 200,
            data: yearList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error',
        });
    }
}

exports.getDataArmada = async (req, res) => {
    try {
        const jenisArmadas = await armada.findAll();
        
        // Ekstrak nama armada saja
        const namaArmadaList = jenisArmadas.map(armada => armada.nama_armada);

        response(req, res, {
            status: 200,
            data: namaArmadaList,
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}
