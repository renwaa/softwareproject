const express = require("express");
const router = express.Router();
const managerController = require("../Controller/managerController");
const userController = require("../Controller/userController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware');

const { route } = require("./users");

router.get("/viewReport", authorizationMiddleware(['manager']), managerController.generateReport);
router.get("/viewAnalytics", authorizationMiddleware(['manager']), managerController.viewAnalytics);
router.get("/viewTickets",authorizationMiddleware(['manager']), managerController.getAllClosedTickets);
router.get("/report/:ticketId", authorizationMiddleware(['manager']), managerController.generateReportPerTicket);
module.exports = router;