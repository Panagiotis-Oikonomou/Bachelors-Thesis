const express = require('express');
const router = express.Router();
const matching = require('../controllers/matchingController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, matching.getMatchings );
router.post("/", ver.verify, matching.createMatchings );
router.put("/", ver.verify, matching.updateAgrees );

module.exports = router;