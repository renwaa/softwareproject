const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const adminController = {
  createUserAcc: async (req, res) => {
    try {
      const { firstName, secondName, email, password, username } = req.body;

      // Check if the requester is an admin
      if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
        return res.status(403).json({ msg: "Access denied. Only admins can create user profiles." });
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already exists. Choose a different email." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new userModel({
        _id: new mongoose.Types.ObjectId(),
        firstName,
        secondName,
        email,
        password: hashedPassword,
        username,
        role: 'user', // Set the role to "user"
      });

      await newUser.save();

      return res.status(200).json({ msg: "User account created successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteUserAcc: async (req, res) => {
    try {
      const { targetUserId } = req.body;

      if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
        return res.status(403).json({ msg: "Access denied. Only admins can delete user accounts." });
      }

      // Check if the target user exists
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
  updateRole: async (req, res) => {
    try {
      // const { userId } = req.user;
      const { targetUserId, newRole } = req.body;

      if (req.user.role !== 'admin'&& req.user.userId !== req.params.id) {
        return res.status(403).json({ msg: "Access denied. Only admins can update user roles." });
      }

      // Check if the target user exists
      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ msg: "Target user not found" });
      }

      // Update the role of the target user
      targetUser.role = newRole;
      await targetUser.save();

      return res.status(200).json({ msg: "User role updated successfully", user: targetUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController;
