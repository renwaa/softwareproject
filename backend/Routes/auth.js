const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");

// * login
router.post("/login",authController.login );
// * register
router.post("/register",authController.register);

module.exports = router; // ! Don't forget to export the router