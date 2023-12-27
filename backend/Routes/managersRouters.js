const express = require("express");
const router = express.Router();
const managerController = require("../Controller/managersControllers");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

router.post("/generateReportPerTicket/:ticketId", authorizationMiddleware(['manager']), managerController.generateReportPerTicket);
router.get("/viewTickets",authorizationMiddleware(['manager']), managerController.viewTickets);
router.get("/viewTicket/:ticketId",authorizationMiddleware(['manager']), managerController.getTicketById);
router.post("/report/:ticketId", authorizationMiddleware(['manager']), managerController.generateReportPerTicket);
router.delete("/deleteReport/:reportId", authorizationMiddleware(['manager']), managerController.deleteReport);
router.get("/viewReport/:reportId", authorizationMiddleware(['manager']), managerController.getReportById);
router.get("/viewReports", authorizationMiddleware(['manager']), managerController.getAllReports);
router.delete("/Analytics/:analyticsId", authorizationMiddleware(['manager']), managerController.deleteteAnalytics);
router.get("/analytics", authorizationMiddleware(['manager']), managerController.viewAnalytics);

module.exports = router;