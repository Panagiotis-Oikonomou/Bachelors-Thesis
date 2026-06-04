const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const work = require('../controllers/adminWorkController');
const ver = require('../middleware/authMiddleware');

router.get("/profile", ver.verify, admin.getProfile);
router.put("/profile", ver.verify, admin.updateAdmin);

router.get("/users", ver.verify, work.getUsers);
router.delete("/users/:userid", ver.verify, work.deleteUser);

module.exports = router;