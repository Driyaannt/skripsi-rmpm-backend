'use strict';

const express = require('express');
const router = express.Router();
const jenisArmadacontroller = require('../controllers/jenisArmadaController');

const { verifyToken } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, controller.createDocumentCode);
router.get('/', verifyToken,jenisArmadacontroller.index);
router.get('/countarmada', verifyToken, jenisArmadacontroller.countJenisArmada);
router.get('/all/', verifyToken,jenisArmadacontroller.getDataAll);
router.post('/', verifyToken,jenisArmadacontroller.create);
router.put('/:id', verifyToken,jenisArmadacontroller.update);
router.delete('/:id', verifyToken,jenisArmadacontroller.delete);
router.delete('/bulk/:ids', verifyToken, jenisArmadacontroller.deleteBulk);


// router.get('/:id', verifyToken, controller.getDocumentCodeById);
// router.put('/:id', verifyToken, controller.updateDocumentCode);
// router.delete('/:id', verifyToken, controller.deleteDocumentCode);
// router.delete('/bulk/:ids', verifyToken, controller.deleteBulkDocumentCode);

module.exports = router;