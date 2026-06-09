const express = require('express');
const router = express.Router();
const notification = require('../controllers/notificationController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, notification.getNotifications);

module.exports = router;