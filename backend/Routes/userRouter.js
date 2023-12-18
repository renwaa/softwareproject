const express = require("express");
const router = express.Router();

const userController = require("../Controller/userController");

router.get("/getFAQs" , userController.getFAQs)
router.get("/searchFAQ" , userController.searchFAQ);
router.post("/createTicket" , userController.createNewTicket);
router.put("/emailNotifications" , userController.emailNotification);
// router.get("/requestChat" , userController.requestRealTimeChat);


module.exports = router;

