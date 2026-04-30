const express = require('express');
const router = express.Router();
const validation = require('../controllers/validationController');
const ver = require('../middleware/authMiddleware');

router.get("/username", validation.checkUsername);
router.get("/email", validation.checkEmail);
router.get("/clock", validation.checkClock);

router.get("/username_profile", ver.verify, validation.checkUsernameProfile);
router.get("/email_profile", ver.verify, validation.checkEmailProfile);
router.get("/clock_profile", ver.verify, validation.checkClockProfile);

module.exports = router;