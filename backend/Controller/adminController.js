const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const adminController = {
    createUserAcc: async (req, res) => {
        try {
            
          
          return res.status(200).json({ msg: "User account created successfully" });
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      }
};