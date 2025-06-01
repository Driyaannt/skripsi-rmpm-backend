const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const { Op } = require('sequelize');
const abnormal = db.skripsiIncomingRmpm.mstAbnormal;


exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 10;
        const offset = (page - 1) * pageSize;
        const search = req.query.search;

        let filterSearch = {};

        if(search){
            filterSearch = {
                [Op.or]: [
                    { abnormal: { [Op.like]: `%${search}%` } },
                ]
            };
        }

        const abnormals = await abnormal.findAndCountAll(
            
            {
                where:{
                    ...filterSearch
                },
                limit: pageSize,
                offset: offset,
                order: [['id', 'DESC']]
            });
        // const abnormals = await abnormal.findAll();
        response(req, res, {
            status: 200,
            data: abnormals,
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}


exports.getDataAll = async (req, res) => {
    try {
        const abnormals = await abnormal.findAll();
        response(req, res, {
            status: 200,
            data: abnormals,
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}
exports.create = async (req, res) => {
    try {
        req.body.created_at = new Date();
        req.body.updated_at = new Date();
        console.log(req.body.abnormal);
        await abnormal.create(req.body
        );
        response(req, res, {
            status: 200,
            data: req.body.abnormal,
            message: "Data berhasil ditambahkan"
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
            message: "Data gagal ditambahkan"
        });
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const updateAbnormal = await abnormal.findByPk(id);
        if (!updateAbnormal) {
            response(req, res, {
                status: 404,
                message: 'User not found',
            });
        } else {
            req.body.updated_at = new Date();
            await updateAbnormal.update(req.body);
            response(req, res, {
                status: 200,
                data: updateAbnormal,
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

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteAbnormal = await abnormal.findByPk(id);
        if (!deleteAbnormal) {
            response(req, res, {
                status: 404,
                message: 'User not found',
            });
        } else {
            await deleteAbnormal.destroy();
            response(req, res, {
                status: 204,
                // data: deleteAbnormal,
                message: "Data berhasil dihapus"

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

exports.deleteBulk = async (req, res) => {
    try {
        const ids = req.params.ids.split(",");
        const deleteAbnormal = await abnormal.destroy({ where: { id: ids } });
        if (!deleteAbnormal) {
            response(req, res, {
                status: 404,
                message: 'User not found',
            });
        } else {
            response(req, res, {
                status: 204,
                // data: deleteAbnormal,
                message: "Data berhasil dihapus"

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