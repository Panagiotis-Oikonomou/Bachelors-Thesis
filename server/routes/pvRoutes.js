const express = require('express');
const router = express.Router();
const pv = require('../controllers/pvController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, pv.getPV);

module.exports = router;