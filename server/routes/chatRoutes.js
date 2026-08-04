const express = require('express');
const router = express.Router();
const chat = require('../controllers/chatController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, chat.getChats );
router.get("/chat/:chatid", ver.verify, chat.getMessages );
router.post("/", ver.verify, chat.createMessage );

router.get("/offline-notifications", ver.verify, chat.getOfflineNotifications);
router.put("/zero/:chatid", ver.verify, chat.turnToZeroUnreadMessages);
router.post("/notifications", ver.verify, chat.updateUnreadMessages );

router.get("/messages", ver.verify, chat.getLatestMessages );
router.get("/waiting_delete/:chatid", ver.verify, chat.getWatingDelete );
router.post("/online_users", ver.verify, chat.getOnlineChatUsers );
router.put("/:messageid", ver.verify, chat.deleteMessage );
router.put("/waiting_delete/:d/:chatid", ver.verify, chat.changeWaitingDelete );
router.put("/chatname/:chatid", ver.verify, chat.updateChatName );
router.delete("/:chatid", ver.verify, chat.deleteChat );
module.exports = router;