const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const logout = require('../controllers/logoutController');
const ver = require('../middleware/authMiddleware');

router.get("/profile", ver.verify, user.getProfile);
router.put("/profile", ver.verify,user.updateUser);

module.exports = router;