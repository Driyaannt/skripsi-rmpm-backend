'use strict';

const express = require('express');
const router = express.Router();
const testingAhpController = require('../controllers/testingAhpController');

const { verifyToken } = require('../middlewares/authMiddleware');

// router.get('/datamentah', ahpController.index);
router.post('/calculate', verifyToken, testingAhpController.calculateAHPScores);

module.exports = router;