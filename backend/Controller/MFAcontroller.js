const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel")
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const speakeasy = require('speakeasy');
const nodemailer = require("nodemailer");

const mfaController = {
    verifyMfa: async (req, res, user) =>{
        try{
        const { mfaCode } = req.body;
    
        if (!mfaCode) {
          return res.status(405).json({ message: "MFA code not provided" });
        }
        const mfaSecret = user.mfaSecret;
    
        const mfaVerified = speakeasy.totp.verify({
          secret: mfaSecret,
          encoding: "base32",
          token: mfaCode,
        });
    
        if (!mfaVerified) {
          return res.status(403).json({ message: "Invalid MFA code" });
        }
        const currentDateTime = new Date();
          const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
    
          // Generate a JWT token
          const token = jwt.sign(
            { user: { userId: user._id, role: user.role, email: user.email} },
            secretKey,
            {
              expiresIn: 3 * 60 * 60,
            }
          );
          res.cookie("token", token, {
            httpOnly: false,
            SameSite: "none",
          });
    
          let newSession = new sessionModel({
            userId: user._id,
            token,
            expiresAt: expiresAt,
          });
    
          await newSession.save();
    
          return res
            .cookie("token", token, {
              expires: expiresAt,
              withCredentials: true,
              httpOnly: false,
              SameSite: "none",
            })
            .status(200)
            .json({ message: "Login successful", user });
        } catch (error) {
          console.error("Cannot Verify User", error);
          return res.status(500).json({ message: "Server error" });
        }
      },
};


module.exports = mfaController;