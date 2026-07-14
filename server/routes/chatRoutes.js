const express = require('express');
const router = express.Router();
const chat = require('../controllers/chatController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, chat.getChats );
router.post("/", ver.verify, chat.createMessage );
router.get("/:chatid", ver.verify, chat.getMessages );
router.put("/:messageid", ver.verify, chat.deleteMessage );
router.post("/online_users", ver.verify, chat.getOnlineChatUsers );
router.get("/messages/:userid", ver.verify, chat.getLatestMessages );
module.exports = router;