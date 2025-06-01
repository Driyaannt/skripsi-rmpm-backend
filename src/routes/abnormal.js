'use strict';

const express = require('express');
const router = express.Router();
const abnormalController = require('../controllers/abnormalController');

const { verifyToken } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, controller.createDocumentCode);
router.get('/', verifyToken,abnormalController.index);
router.get('/all',verifyToken, abnormalController.getDataAll);
router.post('/', verifyToken,abnormalController.create);
router.put('/:id',verifyToken, abnormalController.update);
router.delete('/:id', verifyToken,abnormalController.delete);
router.delete('/bulk/:ids', verifyToken, abnormalController.deleteBulk);

module.exports = router;