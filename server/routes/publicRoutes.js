const express = require('express');
const router = express.Router();
const public = require('../controllers/publicController');

router.post("/register", public.register);
router.post("/login", public.login);

module.exports = router;