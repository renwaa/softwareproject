const express = require("express");
const router = express.Router();

const realTimeChatController = require("../Controller/realTimeChatController");

router.post("/chat" , realTimeChatController.createChat)
router.post("/chatmsg" , realTimeChatController.sendMessage)
// router.post("/chat/:id" , realTimeChatController.sendMessage)


module.exports = router;