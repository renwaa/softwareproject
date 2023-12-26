const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const agentModel = require("../Models/agentModel");

const adminController = {
  getAllUsers: async (req, res) => {
    try {
    
      const users = await userModel.find();
      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },

deleteUserAcc: async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ msg: "Access denied. Only admins can delete user accounts." });
    }
    console.log('targetuserId: ',targetUserId)
    const targetUser = await userModel.findById(targetUserId);


    if (!targetUser) {
      return res.status(404).json({ msg: "Target user not found" });
    }

    await targetUser.deleteOne();

    return res.status(200).json({ msg: "User account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},

setRole: async (req, res) => {
  console.log("1");
  const userId = req.params.userId;
  const { role } = req.body;
  
  let userToUpdate;
  console.log("try 0")
  try {
    console.log("try 1")
    if (role === 'Admin' || role === 'Manager') {
      console.log("try 2")
      userToUpdate = await userModel.findByIdAndUpdate(
        userId,
        { $set: { role } },
        { new: true }
      );
    } else if (role === 'Agent 1' || role === 'Agent 2' || role === 'Agent 3') {
      console.log("try 3")
      
      const agentExists = await agentModel.findOne({ role: role });
      console.log("try 4")
      if (agentExists) {
        return res.status(400).json({ message: `Role ${role} already exists` });
      }

      userToUpdate = await agentModel.findByIdAndUpdate(
        userId,
        { $set: { role } },
        { upsert: true, new: true }
      );
    } else {
      console.log("try 4")
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `Role set to ${role} for user with ID ${userId}` });
  } catch (error) {
    console.error('Error setting role:', error);
    res.status(500).json({ message: 'Server error' });
  }
},


customize: async (req, res) => {
  try {
    // Check if the user making the request is an administrator
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Permission denied. Administrator rights required." });
    }

    const { backgroundColor, fontColor, fontSize } = req.body;
    
    if (!backgroundColor && !fontColor && !fontSize) {
      return res.status(400).json({ message: "Request body is empty. No changes made." });
    }
    
    // Update the appearance settings in the database
    const updatedSettings = {
      backgroundColor: backgroundColor ? getColorHex(backgroundColor) || backgroundColor : undefined,
      fontColor: fontColor ? getColorHex(fontColor) || fontColor : undefined,
      fontSize,
    };

    // Save the updated settings to the database
    const customization = await customizationModel.findOneAndUpdate({}, updatedSettings, { upsert: true, new: true });

    res.status(200).json({ message: "Appearance settings updated successfully", customization });
  } catch (error) {
    console.error("Error updating appearance settings:", error);
    res.status(500).json({ message: "Server error" });
  }
},

getCustomization: async (req, res) => {
  try {
    // Optional: Check if the user making the request has certain permissions
    // if (!req.user || !somePermissionCheck(req.user)) {
    //   return res.status(403).json({ message: "Permission denied. Specific rights required." });
    // }
    // Retrieve the customization settings from the database
    const customization = await customizationModel.findOne({});

    if (!customization) {
      return res.status(404).json({ message: "Customization settings not found." });
    }

    res.status(200).json({ message: "Customization settings retrieved successfully", customization });
  } catch (error) {
    console.error("Error retrieving customization settings:", error);
    res.status(500).json({ message: "Server error" });
  }
},


};

module.exports = adminController;


