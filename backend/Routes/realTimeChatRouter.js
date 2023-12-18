const express = require('express');
const router = express.Router();
const realTimeChatController = require("../Controller/realTimeChatController");
// const authorizationMiddleware = require("../Middleware/authorizationMiddleware");


router.post('/createChat', realTimeChatController.createChat);
router.delete('/endChat', realTimeChatController.endChat);
router.get('/requestChat', realTimeChatController.requestRealTimeChat);
router.get('/findAgent', realTimeChatController.findAvailableAgent);





module.exports = router;