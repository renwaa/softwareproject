const express = require("express");
const router = express.Router();

const messageController = require("../Controller/messageController");

router.post("/send" , messageController.sendMessage);
router.get("/getMessages" , messageController.getChatMessages);


module.exports = router;