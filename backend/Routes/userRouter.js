const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware');
const adminController = require("../Controller/adminController");

// user create new ticket 
router.post("/createNewTicket" ,  userController.createNewTicket)
router.get("/searchFAQ", userController.searchFAQ);
router.get("/requestRealTimeChat", userController.requestRealTimeChat);
//router.get('/getCurrentUser', userController.getCurrentUser);
router.put("/userId", authorizationMiddleware(['admin']), adminController.setAgent );

module.exports = router;