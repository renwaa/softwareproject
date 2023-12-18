const express = require("express");
const router = express.Router();

// const userController = require("../Controller/userController");
const authController = require("../Controller/authController");
const adminController = require("../Controller/adminController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");


// router.post("/createuser",authorizationMiddleware(['admin']),adminController.createUserAcc);
router.delete("/deleteuser", authorizationMiddleware(['admin']), adminController.deleteUserAcc);
router.put("/updaterole",authorizationMiddleware(['admin']),adminController.updateRole);
module.exports = router; // ! Don't forget to export the router