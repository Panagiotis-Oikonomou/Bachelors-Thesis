const express = require('express');
const router = express.Router();
const area = require('../controllers/areaController');
const ver = require('../middleware/authMiddleware');

router.post("/", ver.verify, area.addArea);
router.get("/", ver.verify, area.getAreas);

module.exports = router;