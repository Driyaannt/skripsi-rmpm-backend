const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const {Op, where} = require('sequelize');
const { getDataAll } = require("./jenisArmadaController");
const user = db.skripsiIncomingRmpm.mstUser;


exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.size) || 10;
        const offset = (page - 1) * pageSize;
        const location = req.query.location
        const role = req.query.role
        const search = req.query.search

        let filterLocation = {}
        let filterRole = {}
        let filterSearch = {}

        if(location != 'all'){
            filterLocation = {
                location:{
                    [Op.eq]: location
                }
            }
        }

        if(role != 'all'){
            filterRole = {
                role:{
                    [Op.eq]: role
                }
            }
        }
        if (search) {
            filterSearch = {
                [Op.or]: [
                    { nik: { [Op.like]: `%${search}%` } },
                    { nama: { [Op.like]: `%${search}%` } },
                    { perusahaan: { [Op.like]: `%${search}%` } },
                    { location: { [Op.like]: `%${search}%` } },
                    { role: { [Op.like]: `%${search}%` } }

                ]
            };
        }
        const users = await user.findAndCountAll(
           {
            where: {
                ...filterLocation,
                ...filterRole,
                ...filterSearch
                    // role:{
                    //     [Op.eq]: role
                    // }
           },
            limit: pageSize,
            offset: offset,
            order: [['id', 'DESC']]
        });
        response(req, res, {
            status: 200,
            data: users,
        });

    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
        });
    }
}

exports.countUser = async (req, res) => {
    try {
        await user.count()
        .then(count => {    
            response(req, res, {
                status: 200,
                data: count,
            });
        })
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
      
        let filterLocation = {};
        const location = req.query.location;

        if (location) {
            filterLocation = {
                location: {
                    [Op.eq]: location
                }
            };
        }

        const users = await user.findAll({ where: filterLocation });
        response(req, res, {
            status: 200,
            data: users,
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
        // Cek apakah nik sudah ada
        const existingUser = await user.findOne({ where: { nik: req.body.nik } });

        if (existingUser) {
            return response(req, res, {
                status: 400,
                message: "NIK sudah ada di database"
            });
        }

        req.body.created_at = new Date();
        req.body.updated_at = new Date();

        await user.create(req.body);

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
};





exports.delete = async (req, res) => {
    try {
        let id_user = req.params.id;

        const result = await user.destroy({
            where: { id: id_user }
        });

        if (result === 0) {
            return response(req, res, {
                status: 404,
                message: "Data tidak ditemukan"
            });
        }

        response(req, res, {
            status: 200,
            message: "Data berhasil dihapus"
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
            message: "Data gagal dihapus"
        });
    }
};

exports.deleteBulk = async (req, res) => {
    try {
        // Get the IDs from the URL parameters
        const idUsersToDelete = req.params.ids.split(',').map(id => id.trim()); // e.g., "96,95"

        if (!Array.isArray(idUsersToDelete) || idUsersToDelete.length === 0) {
            return response(req, res, {
                status: 400,
                message: "No user IDs provided for deletion"
            });
        }

        // Delete user records
        const deletedCount = await user.destroy({
            where: { id: idUsersToDelete }
        });

        if (deletedCount === 0) {
            return response(req, res, {
                status: 404,
                message: "No users found to delete"
            });
        }

        response(req, res, {
            status: 200,
            message: `${deletedCount} users successfully deleted`
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
            message: "Data deletion failed"
        });
    }
};



exports.update = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID user dari parameter
        const { id_access_aplication, ...userData } = req.body; // Pisahkan data relasi dari data user
        
        // Tambahkan timestamp untuk updated_at
        userData.updated_at = new Date();

        // Update data user
        const result = await user.update(userData, {
            where: { id }
        });

        if (result[0] === 0) {
            return response(req, res, {
                status: 404,
                message: "Data tidak ditemukan atau tidak ada perubahan"
            });
        }

        // Jika ada perubahan pada id_access_aplication, update relasi
        if (id_access_aplication) {
            const accessIds = id_access_aplication.split(', ');
            
            // Hapus semua relasi sebelumnya
            await access.destroy({
                where: { id_user: id }
            });

            // Tambahkan relasi baru
            const accessAppBody = accessIds.map(element => ({
                id_access_aplication: element,
                id_user: id
            }));

            await access.bulkCreate(accessAppBody);
        }

        response(req, res, {
            status: 200,
            message: "Data berhasil diperbarui"
        });
    } catch (error) {
        console.error(error);
        response(req, res, {
            status: 500,
            data: error.message,
            message: "Data gagal diperbarui"
        });
    }
};



// exports.update = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const userUpdate = await user.findByPk(id);
//         if (!userUpdate) {
//             response(req, res, {
//                 status: 404,
//                 message: 'User not found',
//             });
//         } else {
//             req.body.updated_at = new Date();
//             await userUpdate.update(req.body);
//             response(req, res, {
//                 status: 200,
//                 data: userUpdate,
//             });
//         }
//     }
//     catch (error) {
//         console.error(error);
//         response(req, res, {
//             status: 500,
//             data: error,
//         });
//     }
// }

// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const userDelete = await user.findByPk(id);
//         if (!userDelete) {
//             response(req, res, {
//                 status: 404,
//                 message: 'User not found',
//             });
//         } else {
//             await userDelete.destroy();
//             response(req, res, {
//                 status: 204,
//                 // data: userDelete,
                
//             });
//         }
//     }
//     catch (error) {
//         console.error(error);
//         response(req, res, {
//             status: 500,
//             data: error,
//         });
//     }
// }