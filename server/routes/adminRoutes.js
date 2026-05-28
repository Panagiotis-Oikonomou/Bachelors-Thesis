const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const logout = require('../controllers/logoutController');
const ver = require('../middleware/authMiddleware');

router.get("/profile", ver.verify, admin.getProfile);
router.put("/profile", ver.verify, admin.updateAdmin);
// router.get("/logout", logout.logout);

module.exports = router;