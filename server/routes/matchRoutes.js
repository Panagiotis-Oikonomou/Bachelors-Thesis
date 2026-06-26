const express = require('express');
const router = express.Router();
const match = require('../controllers/matchController');
const ver = require('../middleware/authMiddleware');

router.post("/", ver.verify, match.getMatches);

module.exports = router;