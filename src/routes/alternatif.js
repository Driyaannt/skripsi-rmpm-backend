'use strict';

const express = require('express');
const router = express.Router();
const alternatifController = require('../controllers/alternatifController');

const { verifyToken } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, controller.createDocumentCode);
router.get('/', verifyToken,alternatifController.index);
router.get('/countvarian', verifyToken, alternatifController.countVarian);
router.get('/all',verifyToken, alternatifController.getDataAll);
router.get('/materialcode',verifyToken, alternatifController.getMaterialCode);
router.post('/',verifyToken, alternatifController.create);
router.put('/edit/:id',verifyToken, alternatifController.update);
router.delete('/:id',verifyToken, alternatifController.delete);
router.delete('/bulk/:ids', verifyToken, alternatifController.deleteBulk);

module.exports = router;