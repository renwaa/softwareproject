const express = require("express");
const router = express.Router();

const systemController = require("../Controller/systemController");

router.get("/getAllOpenTickets", systemController.getAllOpenTickets);
router.put("/assignTickets", systemController.assignTickets);
router.put("/updateQueue", systemController.updateQueue);

module.exports = router; // Don't forget to export the router