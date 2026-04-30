const express = require('express');
const router = express.Router();
const area = require('../controllers/areaController');
const ver = require('../middleware/authMiddleware');

router.post("/", ver.verify, area.addArea);

module.exports = router;