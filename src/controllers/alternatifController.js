const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { Op } = require('sequelize');
const alternatif = db.skripsiIncomingRmpm.alternatif;
const mstVarian = db.skripsiIncomingRmpm.mstvarian;

exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 10;
        const offset = (page - 1) * pageSize;
        const location = req.query.location
        const search = req.query.search

        let filterLocation = {}
        let filterStatus = {}
        let filterSearch = {}

        if (location !== 'all') {
            filterLocation = {
                location: {
                    [Op.eq]: location
                }
            }
        }
        if (search) {
            filterSearch = {
                [Op.or]: [
                    { nama_alternatif: { [Op.like]: `%${search}%` } },
                    { deskripsi: { [Op.like]: `%${search}%` } },
                    { harga: { [Op.like]: `%${search}%` } },
                    { kapasitas: { [Op.like]: `%${search}%` } },
                    { location: { [Op.like]: `%${search}%` } }
                ]
            };
        }
        const jenisArmadas = await alternatif.findAndCountAll(
            {
                include: [{
                    model: mstVarian,
                    as: 'varian',
                    required: true
                }],
                where: {
                    ...filterLocation,
                    ...filterSearch
                },
                limit: pageSize,
                offset: offset,
            });
        response(req, res, {
            status: 200,
            data: jenisArmadas,
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}

exports.countVarian = async (req, res) => {
    try {
        const count = await mstVarian.count();
        response(req, res, {
            status: 200,
            data: count,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
};


exports.getDataAll = async (req, res) => {
    try {
        const dataAlternatif = await alternatif.findAll({
            include: [{
                model: mstVarian,
                as: 'varian',
                required: true
            }]
        });

        response(req, res, {
            status: 200,
            data: dataAlternatif,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
};

exports.create = async (req, res) => {
    const sequelize = sequelizeInstances.skripsiIncomingRmpm;
    const t = await sequelize.transaction();

    try {
        // 1. Validate required fields
        if (!req.body.kode_material || !req.body.nama_material) {
            await t.rollback();
            return response(req, res, {
                status: 400,
                message: "Kode dan Nama Material wajib diisi"
            });
        }

        // 2. Create or update varian
        let varian;
        if (req.body.varianId) {
            // Update existing varian
            varian = await mstVarian.update({
                kode_material: req.body.kode_material,
                nama_material: req.body.nama_material,
                ukuran: req.body.ukuran,
                updated_at: new Date()
            }, {
                where: { id: req.body.varianId },
                transaction: t,
                returning: true
            });
        } else {
            // Create new varian
            varian = await mstVarian.create({
                kode_material: req.body.kode_material,
                nama_material: req.body.nama_material,
                ukuran: req.body.ukuran,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
        }

        // 3. Create or update alternatif
        if (req.body.id_alternatif) {
            // Update existing alternatif
            await alternatif.update({
                nama_alternatif: req.body.nama_alternatif,
                deskripsi: req.body.deskripsi,
                harga: req.body.harga,
                kapasitas: req.body.kapasitas,
                location: req.body.location,
                updated_at: new Date()
            }, {
                where: { id: req.body.id_alternatif },
                transaction: t
            });
        } else {
            // Create new alternatif
            await alternatif.create({
                id_varian: varian.id,
                nama_alternatif: req.body.nama_alternatif,
                deskripsi: req.body.deskripsi,
                harga: req.body.harga,
                kapasitas: req.body.kapasitas,
                location: req.body.location,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
        }

        // 4. Commit transaction
        await t.commit();

        response(req, res, {
            status: 200,
            message: "Data berhasil disimpan"
        });

    } catch (error) {
        // 5. Rollback on error
        await t.rollback();
        console.error('Transaction error:', error);

        response(req, res, {
            status: 500,
            message: "Data gagal disimpan",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    const sequelize = sequelizeInstances.skripsiIncomingRmpm;
    const t = await sequelize.transaction();

    try {
        const id = req.params.id; // id_alternatif dari route

        // 1. Validasi keberadaan data alternatif
        const updateAlternatif = await alternatif.findByPk(id, { transaction: t });
        if (!updateAlternatif) {
            await t.rollback();
            return response(req, res, {
                status: 404,
                message: 'Data alternatif tidak ditemukan'
            });
        }

        // 2. Update atau validasi varian
        if (!req.body.kode_material || !req.body.nama_material) {
            await t.rollback();
            return response(req, res, {
                status: 400,
                message: "Kode dan Nama Material wajib diisi"
            });
        }

        if (req.body.varianId) {
            // Update varian jika tersedia
            await mstVarian.update({
                kode_material: req.body.kode_material,
                nama_material: req.body.nama_material,
                ukuran: req.body.ukuran,
                updated_at: new Date()
            }, {
                where: { id: req.body.varianId },
                transaction: t
            });
        }

        // 3. Update alternatif
        await updateAlternatif.update({
            id_varian: req.body.id_varian || req.body.varianId,
            nama_alternatif: req.body.nama_alternatif,
            deskripsi: req.body.deskripsi,
            harga: req.body.harga,
            kapasitas: req.body.kapasitas,
            location: req.body.location,
            updated_at: new Date()
        }, { transaction: t });

        // 4. Commit
        await t.commit();

        response(req, res, {
            status: 200,
            message: 'Data berhasil diupdate',
            data: updateAlternatif
        });

    } catch (error) {
        await t.rollback();
        console.error('Transaction error:', error);

        response(req, res, {
            status: 500,
            message: "Data gagal diupdate",
            error: error.message
        });
    }
};


exports.delete = async (req, res) => {
    const sequelize = sequelizeInstances.skripsiIncomingRmpm; // Assuming you have multiple instances

    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const deleteAlternatif = await alternatif.findByPk(id, { transaction: t });
        if (!deleteAlternatif) {
            await t.rollback();
            return response(req, res, {
                status: 404,
                message: 'User not found',
            });
        }

        await deleteAlternatif.destroy({ transaction: t });
        await t.commit();

        response(req, res, {
            status: 204,
            message: 'Data berhasil dihapus',
        });
    } catch (error) {
        await t.rollback();
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message || error,
        });
    }
};

exports.deleteBulk = async (req, res) => {
    const sequelize = sequelizeInstances.skripsiIncomingRmpm; // Assuming you have multiple instances

    const t = await sequelize.transaction();
    try {
        // Misal kamu dapat array id dari req.body.ids untuk dihapus secara bulk
        const ids = req.body.ids; // Contoh: [1, 2, 3]

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            await t.rollback();
            return response(req, res, {
                status: 400,
                message: "Ids tidak boleh kosong dan harus berupa array",
            });
        }

        // Cek dulu apakah data ada (optional)
        const dataToDelete = await alternatif.findAll({
            where: { id: ids },
            transaction: t,
        });

        if (dataToDelete.length === 0) {
            await t.rollback();
            return response(req, res, {
                status: 404,
                message: "Data tidak ditemukan",
            });
        }

        // Bulk delete
        await alternatif.destroy({
            where: { id: ids },
            transaction: t,
        });

        await t.commit();
        response(req, res, {
            status: 200,
            message: "Data berhasil dihapus secara bulk",
        });
    } catch (error) {
        await t.rollback();
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
};


exports.getMaterialCode = async (req, res) => {
    try {
        const materialCode = await mstVarian.findAll();
        response(req, res, {
            status: 200,
            data: materialCode,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}