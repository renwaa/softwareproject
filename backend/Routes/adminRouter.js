const express = require("express");
const router = express.Router();

// const userController = require("../Controller/userController");
const authController = require("../Controller/authController");
const adminController = require("../Controller/adminController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");


router.post("/createuser",authorizationMiddleware(['admin']),adminController.createUserAcc);
router.put("/updateuserrole",authorizationMiddleware(['admin']),adminController.updateUserRole);
module.exports = router; // ! Don't forget to export the router