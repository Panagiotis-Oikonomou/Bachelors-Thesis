const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const ver = require('../middleware/authMiddleware');
// const refresh = require('../services/tokenService');

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/profile", ver.verify, user.getProfile);
router.put("/profile", ver.verify,user.updateUser);

// router.post("/refresh", refresh.refresh);
router.post("/logout", ver.verify, user.logout);


module.exports = router;