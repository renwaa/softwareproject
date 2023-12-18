const express = require("express");
const router = express.Router();
const managerController = require("../Controller/managerController");
const userController = require("../Controller/userController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware');

const { route } = require("../Routes/user");

router.get("/analytics", authorizationMiddleware(['manager']), managerController.viewAnalytics);
router.get("/viewTickets",authorizationMiddleware(['manager']), managerController.getAllClosedTickets);
router.post("/report/:ticketId", authorizationMiddleware(['manager']), managerController.generateReportPerTicket);
router.delete("/deleteReport/:reportId", authorizationMiddleware(['manager']), managerController.deleteReport);
router.get("/viewReports", authorizationMiddleware(['manager']), managerController.getAllReports);
router.delete("/Analytics/:analyticsId", authorizationMiddleware(['manager']), managerController.deleteteAnalytics);

module.exports = router; 