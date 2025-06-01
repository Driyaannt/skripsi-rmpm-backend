'use strict';

const express = require('express');
const router = express.Router();
const pengirimanController = require('../controllers/pengirimanController');


const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/',verifyToken, pengirimanController.create_pengiriman );
router.get('/', verifyToken,pengirimanController.index);
router.get('/getById/:id',verifyToken, pengirimanController.getById);
router.get('/surat',verifyToken, pengirimanController.getSurat);
router.delete('/:id',verifyToken, pengirimanController.deletePengiriman);
router.put('/:id',verifyToken, pengirimanController.updatePengiriman);
// router.get('/:id', verifyToken, controller.getDocumentCodeById);
// router.delete('/bulk/:ids', verifyToken, controller.deleteBulkDocumentCode);

module.exports = router;