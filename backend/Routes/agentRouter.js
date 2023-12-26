const express = require("express");
const router = express.Router();

// const userController = require("../Controller/userController");
const authController = require("../Controller/authController");
const adminController = require("../Controller/adminController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");


router.get("/getAllUsers",adminController.getAllUsers);
router.delete("/deleteUserAcc", authorizationMiddleware(['Admin']), adminController.deleteUserAcc);
router.put("/setRole/:userId", authorizationMiddleware(['Admin']), adminController.setRole);
router.put("/customize", authorizationMiddleware(['admin']), adminController.customize);
router.get("/getCustomization", authorizationMiddleware(['admin']), adminController.getCustomization);

module.exports = router; // ! Don't forget to export the router