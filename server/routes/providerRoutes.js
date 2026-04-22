const express = require('express');
const router = express.Router();
const providers = require('../controllers/providersController');

router.get("/", providers.getProviders);

module.exports = router;