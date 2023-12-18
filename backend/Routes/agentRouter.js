const express = require("express");
const router = express.Router();

const agentController = require ("../Controller/agentController");
router.put("/updateTicket/:ticketId", agentController.updateTicket)


module.exports = router; // ! Don't forget to export the router