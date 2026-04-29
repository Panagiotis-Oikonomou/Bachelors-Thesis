const express = require('express');
const router = express.Router();
const refresh = require('../services/tokenService');

router.post("/", refresh.refresh);

module.exports = router;