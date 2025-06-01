'use strict';

const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, controller.createDocumentCode);
router.get('/', verifyToken, DashboardController.getPengirimanKedatangan);
router.get('/armada-all/', verifyToken,DashboardController.getDataArmada);
router.get('/material',verifyToken, DashboardController.getDataMaterial);
router.get('/suplier' ,verifyToken, DashboardController.getDataSuplier);
router.get('/year',  verifyToken,DashboardController.getYear);

module.exports = router;