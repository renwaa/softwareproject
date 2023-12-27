const express = require('express');
const router = express.Router();
const realTimeChatController = require("../Controller/realTimeChatController");
// const authorizationMiddleware = require("../Middleware/authorizationMiddleware");


router.get("/findagent" , realTimeChatController.findAvailableAgent);
router.post("/requestChat" , realTimeChatController.requestRealTimeChat);
router.put('/endChat/:chatId', realTimeChatController.endChat);
router.post("/send" , realTimeChatController.sendMessage);
router.get("/msgreceive/:chatId" , realTimeChatController.receiveMessage);
router.get("/accessChat/:agentId", realTimeChatController.accessChatByAgent);







module.exports = router;