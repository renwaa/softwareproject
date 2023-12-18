const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const agentController = require("../Controller/agentController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware')

router.put("/closeTicket/:ticketId", authorizationMiddleware(['agent']), agentController.closeTicket);
router.get("/getAllTickets", authorizationMiddleware(['agent']), agentController.getAllTickets);
router.get("/getAllOpenTickets",authorizationMiddleware(['agent']),agentController.getAllOpenTickets);

module.exports = router;