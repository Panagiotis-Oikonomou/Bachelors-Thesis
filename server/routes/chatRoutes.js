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
router.get("/waiting_delete/:chatid", ver.verify, chat.getWatingDelete );
router.put("/waiting_delete/:d/:chatid", ver.verify, chat.changeWaitingDelete );
router.delete("/:chatid", ver.verify, chat.deleteChat );
module.exports = router;