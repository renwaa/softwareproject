const express = require("express");
const router = express.Router();


const userController = require("../Controller/userController");
const authenticate = require('../middleware/authenticationMiddleware');

router.get("/searchFAQ", userController.searchFAQ);
router.put("/rateAgent", userController.rateAgent);
router.post("/requestRealTimeChat", userController.requestRealTimeChat);
router.post("/enable-mfa", authenticate, userController.enableMFA);
router.post("/disable-mfa", authenticate, userController.disableMFA);

module.exports = router;