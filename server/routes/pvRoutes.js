const express = require('express');
const router = express.Router();
const pv = require('../controllers/pvController');

router.post("/get_pv", pv.getPV);

module.exports = router;