const { db, sequelizeInstances } = require("../../config/sequelize");
const { Op } = require('sequelize'); // Import Op from Sequelize
const response = require("../tools/response");

const kondisiKendaraan = db.skripsiIncomingRmpm.mstKondisiKendaraan;

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
                    { kondisi: { [Op.like]: `%${search}%` } },
                ]
            };
        }

        const kondisis = await kondisiKendaraan.findAndCountAll(
            
            {
                where:{
                    ...filterSearch
                },
                limit: pageSize,
                offset: offset,
                order: [['id', 'DESC']]
            });
        response(req, res, {
            status: 200,
            data: kondisis,
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}


// post 

exports.post = async (req, res) => {
    try {
        const kirimKondisi = db.incomingRmpm.mstKondisiKendaraan;
        const kondisiKendaraan = await kirimKondisi.create(req.body);
        response(req, res, {
            status: 200,
            data: kondisiKendaraan,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: error.name === 'SequelizeUniqueConstraintError' ? 409 : 500,
            data: error,
        });
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const kondisiUpdate = await kondisiKendaraan.findByPk(id);
        if (!kondisiUpdate) {
            response(req, res, {
                status: 404,
                message: 'User not found',
            });
        } else {
            req.body.updated_at = new Date();
            await kondisiUpdate.update(req.body);
            response(req, res, {
                status: 200,
                data: kondisiUpdate,
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
        const kondisiDelete = await kondisiKendaraan.findByPk(id);
        if (!kondisiDelete) {
            response(req, res, {
                status: 404,
                message: 'User not found',
            });
        } else {
            await kondisiDelete.destroy();
            response(req, res, {
                status: 204,
                // data: userDelete,
            });
        }
    }catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}


exports.deleteBulk = async (req, res) => {
    try {
        const ids = req.params.ids.split(',');
        const kondisiDelete = await kondisiKendaraan.destroy({ where: { id: ids } });
        response(req, res, {
            status: 204,
            data: kondisiDelete,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}