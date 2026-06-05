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

router.get("/username_profile_admin", ver.verify, validation.checkUsernameProfileAdmin);
router.get("/email_profile_admin", ver.verify, validation.checkEmailProfileAdmin);

router.get("/provider_name/:providername", ver.verify, validation.checkProviderName);

module.exports = router;