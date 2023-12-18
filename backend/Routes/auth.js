const express = require("express");
const router = express.Router();

const authenticationController = require("../Controller/authController");

// * login
router.post("/login",authenticationController.login );
// * register
router.post("/register",authenticationController.register);

module.exports = router; // ! Don't forget to export the router
