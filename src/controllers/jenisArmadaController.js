const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const {Op} = require('sequelize');
const jenisArmada = db.skripsiIncomingRmpm.mstJenisArmada;


exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 10;
        const offset = (page - 1) * pageSize;
        const location = req.query.location
        const status = req.query.status
        const search = req.query.search

        let filterLocation = {}
        let filterStatus = {}
        let filterSearch = {}

        if(location){
            filterLocation = {
                location:{
                    [Op.eq]: location
                }
            }
        }
        if(status){
            filterStatus = {
                status:{
                    [Op.eq]: status
                }
            }
        }
        if(search){
            filterSearch = {
                [Op.or]: [
                    { nama_armada: { [Op.like]: `%${search}%` } },
                    { status: { [Op.like]: `%${search}%` } },
                    { location: { [Op.like]: `%${search}%` } }
                ]
            };
        }
        const jenisArmadas = await jenisArmada.findAndCountAll(
           {
            where: {
                ...filterLocation,
                ...filterStatus,
                ...filterSearch
           },
            limit: pageSize,
            offset: offset,
            order: [['id', 'DESC']]
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

exports.countJenisArmada = async (req, res) => {
    try {
        const count = await jenisArmada.count();
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
}


exports.getDataAll = async (req, res) => {
    try {
       
        const jenisArmadas = await jenisArmada.findAll();
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

exports.getByLocation = async (req, res) => {
    try {
        const location = req.params.location;
        const jenisArmadas = await jenisArmada.findAll({
            where: {
                location: location
            }
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


exports.create = async (req, res) => {
    try {
        req.body.created_at = new Date();
        req.body.updated_at = new Date();
        console.log("iniii hasil postnyaa:",req.body)
    await jenisArmada.create(
        {
            nama_armada: req.body.jenis.nama_armada,
            status: req.body.jenis.status,
            location:req.body.jenis.location,

        }
    );
    response(req, res, {
        status: 200,
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
        const armadaUpdate = await jenisArmada.findByPk(id);
        if (!armadaUpdate) {
            response(req, res, {
                status: 404,
                message: 'User not found',
            });
        } else {
            req.body.updated_at = new Date();
            await armadaUpdate.update(req.body);
            response(req, res, {
                status: 200,
                data: armadaUpdate,
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
        const armadaDelete = await jenisArmada.findByPk(id);
        if (!armadaDelete) {
            response(req, res, {
                status: 404,
                message: 'User not found',
            });
        } else {
            await armadaDelete.destroy();
            response(req, res, {
                status: 204,
                // data: armadaDelete,
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
        const ids = req.params.ids.split(',');
        const armadaDelete = await jenisArmada.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });

        if (armadaDelete.length === 0) {
            response(req, res, {
                status: 404,
                message: 'No records found for the given IDs',
            });
        } else {
            // Delete the records
            await jenisArmada.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });

            response(req, res, {
                status: 204,
                data: armadaDelete,
            });
        }
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
};
