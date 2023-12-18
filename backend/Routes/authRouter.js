const express = require("express");
const router = express.Router();

const authController = require("../Controller/authController");

router.post("/login", authController.login );
router.post("/register",authController.register);
router.get("/id",authController.getCurrentUser);

module.exports = router; // ! Don't forget to export the router
