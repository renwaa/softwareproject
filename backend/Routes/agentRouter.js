const express = require("express");
const router = express.Router();

const agentController = require("../Controller/agentController");

router.post("/addFAQ" , agentController.addFAQ);
router.delete("/deleteFAQ/:id" , agentController.deleteFAQ);
router.put("/updateTicket/:id" , agentController.updateTicket);

module.exports = router;