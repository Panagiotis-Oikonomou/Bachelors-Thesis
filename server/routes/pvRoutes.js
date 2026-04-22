const express = require('express');
const router = express.Router();
const pv = require('../controllers/pvController');

router.get("/", pv.getPV);

module.exports = router;