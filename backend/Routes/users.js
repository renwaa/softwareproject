const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware')

router.get("/getWorkflow",authorizationMiddleware(['user']),userController.getWorkflow);
router.put('/resetPassword', userController.resetPassword);
module.exports = router;