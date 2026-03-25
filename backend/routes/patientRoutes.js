const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, patientController.createPatient);
router.get('/', verifyToken, patientController.getAllPatients);

module.exports = router;