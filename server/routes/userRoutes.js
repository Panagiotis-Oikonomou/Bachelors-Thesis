const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const ver = require('../middleware/authMiddleware');

router.get("/profile", ver.verify, user.getProfile);
router.put("/profile", ver.verify,user.updateUser);
// router.get("/logout", ver.verify, user.logout);
router.get("/logout", user.logout);

module.exports = router;