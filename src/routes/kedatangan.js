'use strict';

const express = require('express');
const router = express.Router();
const kedatanganController = require('../controllers/kedatanganController');


const { verifyToken } = require('../middlewares/authMiddleware');


router.post('/', verifyToken, kedatanganController.create_kedatangan);
router.get('/', verifyToken, kedatanganController.index);
router.get('/getById/:id', verifyToken, kedatanganController.getById);
router.delete('/:id', verifyToken, kedatanganController.deleteKedatangan);
router.put('/:id', verifyToken, kedatanganController.updateKedatangan);

// POST /api/kedatangan/import-excel
router.post('/import-json', express.json(), kedatanganController.importJson);

module.exports = router;