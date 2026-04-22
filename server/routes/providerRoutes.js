const express = require('express');
const router = express.Router();
const providers = require('../controllers/providersController');

router.post("/get_providers", providers.getProviders);

module.exports = router;