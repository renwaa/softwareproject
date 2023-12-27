const express = require("express");
const router = express.Router();

const adminController = require("../Controller/adminsControllers");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

router.get("/getAllUsers" , adminController.getAllUsers);
router.put("/setRole/:userId" , adminController.setRole);
router.put("/customize" , adminController.customize);
router.get("/getCustomization" , adminController.getCustomization);

module.exports = router;