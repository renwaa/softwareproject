const express = require("express");
const router = express.Router();
const agentController = require("../Controller/agentController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware');

router.put("/updateTicket/:ticketId", authorizationMiddleware(['agent']), agentController.updateTicket)

module.exports = router; 