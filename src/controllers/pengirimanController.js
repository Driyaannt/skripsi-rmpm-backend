const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const {Op} = require('sequelize');
const pengiriman = db.skripsiIncomingRmpm.trPengiriman;
const surat = db.skripsiIncomingRmpm.trSurat;


exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 10;
        const offset = (page - 1) * pageSize;
        const location = req.query.location;
        const search = req.query.search;
        let filterSearch = {};

        if (location) {
            filterLocation = {
                location: {
                    [Op.eq]: location
                }
            };
        }
       
        if (search) {
            filterSearch = {
                [Op.or]: [
                    { keperluan: { [Op.like]: `%${search}%` } },    
                    { tujuan: { [Op.like]: `%${search}%` } },    
                    { alamat: { [Op.like]: `%${search}%` } },    
                    { nopol: { [Op.like]: `%${search}%` } },   
                    { jenis_kendaraan: { [Op.like]: `%${search}%` } },    
                    { no_cont: { [Op.like]: `%${search}%` } },    
                    { nama_ekspedisi: { [Op.like]: `%${search}%` } },    
                    { no_segel: { [Op.like]: `%${search}%` } },
                    { kondisi_segel: { [Op.like]: `%${search}%` } },
                    { ketnosegel: { [Op.like]: `%${search}%` } },    
                    { display_suhu: { [Op.like]: `%${search}%` } },    
                    { nama_sopir: { [Op.like]: `%${search}%` } },    
                    { kondisiArmada: { [Op.like]: `%${search}%` } },   
                    { cek_pest_armada: { [Op.like]: `%${search}%` } },  
                    { pengganjal_roda: { [Op.like]: `%${search}%` } },   
                    { temuan_pest: { [Op.like]: `%${search}%` } },    
                    { pengiriman_pallet: { [Op.like]: `%${search}%` } }, 
                    { kondisi_pallet: { [Op.like]: `%${search}%` } },  
                    { pest_material: { [Op.like]: `%${search}%` } },   
                    { temuan_pest_pallet: { [Op.like]: `%${search}%` } },     
                    { nama_checker: { [Op.like]: `%${search}%` } },    
                    { nama_driver: { [Op.like]: `%${search}%` } },    
                    { nama_loader: { [Op.like]: `%${search}%` } }, 
                    { diisi_oleh: { [Op.like]: `%${search}%` } }, 
                    { verifier: { [Op.like]: `%${search}%` } },     

                ]
            };
        }

        const pengirimans = await pengiriman.findAll({
            where: {
                ...filterLocation,
                ...filterSearch
            },
            include: [{
                model: surat,
                as: 'surats',
                required: true
            }],
            limit: pageSize,
            offset: offset,
            order: [['id', 'DESC']]
        });

        const pengirimanCount = await pengiriman.count({
            where: {
                ...filterLocation,
                ...filterSearch
            }
        });

        response(req, res, {
            status: 200,
            data: {
                rows: pengirimans,
                count: pengirimanCount,
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

exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const pengirimanDetail = await pengiriman.findByPk(id, {
            include: [{
                model: surat,
                as: 'surats',
                required: true
            }]
        });
        if (!pengirimanDetail) {
            response(req, res, {
                status: 404,
                message: 'Pengiriman not found',
            });
        } else {
            response(req, res, {
                status: 200,
                data: pengirimanDetail,
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

exports.getSurat = async (req, res) => {
    try {
        const surats = await surat.findAll();
        response(req, res, {
            status: 200,
            data: surats,
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.create_pengiriman = async (req, res) => {
    try {
        req.body.createdAt = new Date();
        req.body.updatedAt = new Date();

    let pengirimans = await pengiriman.create(req.body);

    let surats = req.body.surat;
    // surats.forEach(async (s) => {
    //     s.pengiriman_id = id_pengiriman;
    //     await surat.create(surat);
    // });

    for (const s of surats) {
        s.createdAt = new Date();
        s.updatedAt = new Date();
        s.pengiriman_id = pengirimans.id;
        await surat.create(s);
    }

    response(req, res, {
        status: 200,
        data: pengirimans,
    });
    }
    catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error,
        });
    }
}

exports.deletePengiriman = async (req, res) => {
    try {
        const id = req.params.id;
        const pengirimanDelete = await pengiriman.findByPk(id);
        if (!pengirimanDelete) {
            response(req, res, {
                status: 404,
                message: 'Pengiriman not found',
            });
        } else {
            await surat.destroy({
                where : {
                    pengiriman_id : id
                }
            });
            await pengirimanDelete.destroy();
            response(req, res, {
                status: 204,
                // data: pengirimanDelete,
                
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

// exports.updatePengiriman = async (req, res) => {
//     try {
//         const id = req.params.id;
//         req.body.updatedAt = new Date();
//         const pengirimanUpdate = await pengiriman.findByPk(id);
//         if (!pengirimanUpdate) {
//             response(req, res, {
//                 status: 404,
//                 message: 'Pengiriman not found',
//             });
//         } else {
//             await pengirimanUpdate.update(req.body);
//             response(req, res, {
//                 status: 200,
//                 data: pengirimanUpdate,
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         response(req, res, {
//             status: 500,
//             data: error,
//         });
//     }
// }

// update pengiriman dan surat
exports.updatePengiriman = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.updatedAt = new Date();
        const pengirimanUpdate = await pengiriman.findByPk(id);
        if (!pengirimanUpdate) {
            response(req, res, {
                status: 404,
                message: 'Pengiriman not found',
            });
        } else {
            await pengirimanUpdate.update(req.body);
            let surats = req.body.surat;
            await surat.destroy({
                where: {
                    pengiriman_id: id
                }
            });
            for (const s of surats) {
                s.createdAt = new Date();
                s.updatedAt = new Date();
                s.pengiriman_id = pengirimanUpdate.id;
                await surat.create(s);
            }
            response(req, res, {
                status: 200,
                data: pengirimanUpdate,
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
