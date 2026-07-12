const express = require('express');
const router = express.Router();
const chat = require('../controllers/chatController');
const ver = require('../middleware/authMiddleware');

router.get("/", ver.verify, chat.getChats );
router.post("/", ver.verify, chat.createMessage );
router.get("/:chatid", ver.verify, chat.getMessages );
router.post("/online_users", ver.verify, chat.getOnlineChatUsers );
module.exports = router;