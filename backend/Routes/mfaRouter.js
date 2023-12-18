const express = require("express");
const router = express.Router();


const mfaController = require("../Controller/mfaController");
const authenticate = require('../middleware/authenticationMiddleware');


router.post("/verifyMfa", authenticate, mfaController.verifyMfa);

module.exports = router;