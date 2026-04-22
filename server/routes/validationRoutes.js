const express = require('express');
const router = express.Router();
const validation = require('../controllers/validationController');

router.get("/username/:username", validation.checkUsername);
router.get("/email/:email", validation.checkEmail);
router.get("/clock/:clock", validation.checkClock);

router.get("/username-profile", validation.checkUsernameProfile);
router.get("/email-profile", validation.checkEmailProfile);
router.get("/clock-profile", validation.checkClockProfile);
router.get("/password-profile", validation.checkPasswordProfile);

module.exports = router;