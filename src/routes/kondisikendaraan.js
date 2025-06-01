'use strict';

const express = require('express');
const router = express.Router();
const kondisiKendaraancontroller = require('../controllers/kondisiKendaraanController');

const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/',verifyToken, kondisiKendaraancontroller.index);
router.post('/',verifyToken, kondisiKendaraancontroller.post);
router.put('/:id',verifyToken, kondisiKendaraancontroller.update);
router.delete('/:id',verifyToken, kondisiKendaraancontroller.delete);
router.delete('/bulk/:ids', verifyToken, kondisiKendaraancontroller.deleteBulk);

// router.get('/:id', verifyToken, controller.getDocumentCodeById);
// router.put('/:id', verifyToken, controller.updateDocumentCode);
// router.delete('/:id', verifyToken, controller.deleteDocumentCode);
// router.delete('/bulk/:ids', verifyToken, controller.deleteBulkDocumentCode);

module.exports = router;