const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/profile", user.verify, user.getProfile);
router.put("/profile/:id", user.updateUser);
router.post("/refresh", user.refresh);

module.exports = router;