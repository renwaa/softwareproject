const express = require("express");
const router = express.Router();

const MFAcontroller = require("../Controller/MFAController.js");

router.post("/mfa", MFAcontroller.verifyMfa );


module.exports = router; // ! Don't forget to export the router
