const express = require("express");
const router = express.Router();


const userController = require("../Controller/userController");
const agentController = require("../Controller/AgentController");
const managerController = require("../Controller/managerController");
const adminController = require("../Controller/adminController");
const authController = require("../Controller/authController");



router.post("/login", authController.login );
router.post("/register",authController.register);
router.get("/getCurrentUser", authController.getCurrentUser);




module.exports = router; // ! Don't forget to export the router
