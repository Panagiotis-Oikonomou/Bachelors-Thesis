const express = require('express');
const router = express.Router();
const validation = require('../controllers/validationController');

router.get("/username", validation.checkUsername);
router.get("/email", validation.checkEmail);
router.get("/clock", validation.checkClock);

router.get("/username_profile", validation.checkUsernameProfile);
router.get("/email_profile", validation.checkEmailProfile);
router.get("/clock_profile", validation.checkClockProfile);
router.get("/password_profile", validation.checkPasswordProfile);

module.exports = router;