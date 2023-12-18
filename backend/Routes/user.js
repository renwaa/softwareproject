const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware')

// user create new ticket 

router.post("/createNewTicket",authorizationMiddleware(['user']), userController.createNewTicket);
router.post("/rateagent/:ticketId", authorizationMiddleware(['user']), userController.userRate);

module.exports = router; 