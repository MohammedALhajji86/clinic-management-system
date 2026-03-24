const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// عندما يرسل أحدهم طلب POST إلى هذا المسار، قم بتشغيل دالة createPatient
router.post('/', patientController.createPatient);

module.exports = router;