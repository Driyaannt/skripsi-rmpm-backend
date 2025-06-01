'use strict';

const express = require('express');
const router = express.Router();
const ahpController = require('../controllers/ahpController');

const { verifyToken } = require('../middlewares/authMiddleware');

// router.get('/datamentah', ahpController.index);
router.get('/years',verifyToken, ahpController.getYearListAhpCalculation);
router.get('/ahpdetails/:calculationId', ahpController.getAHPDetails);
router.get('/check-data', verifyToken, ahpController.cekDataInValidGenerate); 
router.get('/by-year', verifyToken, ahpController.getCalculationsYear);

router.post('/calculate', verifyToken, ahpController.calculateAHPScores);
router.get('/ranking', ahpController.getVendorRanking);
router.get('/detail-rangking/:calculationId', ahpController.getAhpCalculationDetail);

module.exports = router;