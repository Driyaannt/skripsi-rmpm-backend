'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

const { verifyToken } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, controller.createDocumentCode);
router.get('/', verifyToken,controller.index);
router.get('/countuser', verifyToken, controller.countUser);
router.get('/all/',verifyToken, controller.getDataAll);
router.post('/',verifyToken, controller.create);
router.put('/:id',verifyToken, controller.update);
router.delete('/:id',verifyToken, controller.delete);
router.delete('/bulk/:ids', verifyToken, controller.deleteBulk);
// router.delete('/bulk/:ids', verifyToken, controller.deleteBulkDocumentCode);

module.exports = router;