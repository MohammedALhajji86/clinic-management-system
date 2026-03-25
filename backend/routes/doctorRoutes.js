const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, doctorController.getAllDoctors);

module.exports = router;