const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/:id", user.getProfile);
router.put("/:id", user.updateUser);
router.get("/checkAuth",user.verifyJwt,  user.jwtAuth);

module.exports = router;