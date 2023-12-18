const userModel = require("../Models/userModel");
const realTimeChat = require("../Models/realTimeChatModel");
const ticketModel = require("../Models/ticketModel");
const workflowModel = require("../Models/workflowmodels");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey =process.env.SECRET_KEY ;
const bcrypt = require("bcrypt");
const userController = {
    getWorkflow: async (req, res) => {
        try{
            const {subCategory} = req.body;
            const workflow = await workflowModel.findOne({ 'subCategory': { $in: [subCategory] } });
            if (!workflow) {
                res.status(404).json({ error: 'Workflow not found for the provided ticket' });
                return;
              }
            
            res.status(200).json({ message : "a custome work was found" , workflow});
        }catch (error) {
      return res.status(500).json({ message: error.message });
    }
    },
    resetPassword: async (req, res) => {
      try {
        const { email, oldPassword, newPassword } = req.body;
  
        // Check if the user exists
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Check if the old password matches
        const isPasswordMatch = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isPasswordMatch) {
          return res.status(401).json({ message: "Incorrect old password" });
        }
  
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Check if the new password is the same as the old password
        if (oldPassword === newPassword) {
          return res.status(400).json({ message: "New password must be different from the old password" });
        }
        // Update the user's password in the database
        existingUser.password = hashedPassword;
        await existingUser.save();
  
        res.status(200).json({ message: "Password reset successfully" });
      } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error" });
      }
    },
  
};
module.exports = userController;