const express = require("express");
const router = express.Router();

const userController = require("../Controller/userController");
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');

console.log("enter router");
router.get("/getFAQs" , userController.getFAQs)
router.get("/searchFAQ" , userController.searchFAQ);
router.post("/createTicket" , userController.createNewTicket);
router.get("/emailNotifications/:userId" , userController.emailNotification);
router.get("/requestChat" , userController.requestRealTimeChat);
router.get("/viewTicket/:userId" , userController.viewMyTickets);
router.get("/getWorkflow/:subCategory",userController.getWorkflow);
router.put('/resetPassword', userController.resetPassword);
router.put('/updateProfile/:id', userController.updateUserProfile);



module.exports = router;



