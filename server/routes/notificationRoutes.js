const express = require('express');
const router = express.Router();
const notification = require('../controllers/notificationController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, notification.getNotifications);
router.put("/:id", ver.verify, notification.readMessage);
router.delete("/:id", ver.verify, notification.deleteMessage);
router.post("/", ver.verify, notification.createInvitationNotification);

module.exports = router;