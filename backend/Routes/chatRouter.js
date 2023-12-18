const express = require("express");
const router = express.Router();

const chatController = require("../Controller/chatController");

router.post("/createChat", chatController.createChat);


module.exports = router;