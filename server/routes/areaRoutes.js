const express = require('express');
const router = express.Router();
const area = require('../controllers/areaController');

router.post("/", area.addArea);

module.exports = router;