const express = require('express');
const router = express.Router();
const notification = require('../controllers/notificationController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, notification.getNotifications);
router.get("/all-page", ver.verify, notification.getGlobalNotifications);
router.put("/:id", ver.verify, notification.readMessage);
router.delete("/:id", ver.verify, notification.deleteMessage);
router.post("/", ver.verify, notification.createInvitationNotification);
router.put("/disabled/:id", ver.verify, notification.updateDisabled);
router.put("/disable", ver.verify, notification.updateAllDisabled);

module.exports = router;