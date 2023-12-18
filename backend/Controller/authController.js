const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel")
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const speakeasy = require('speakeasy');
const nodemailer = require("nodemailer");
const {verifyMfa} = require("./mfaController");

const authController = {
  register: async (req, res) => {
    try {
      const {firstName, secondName, email, password, username, role } = req.body;

      // Check if the user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with the provided role
      const newUser = new userModel({
        firstName,
        secondName,
        email,
        password: hashedPassword,
        username,
        role // Assign the provided role
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  /*generateMFASecret: async function() {
    const secret = speakeasy.generateSecret();
    // Save the secret.key in a secure way associated with the user
    return secret;
  },*/

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      let user = await userModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(405).json({ message: "Incorrect password" });
      }

      // Check if MFA is enabled for the user
      if (user.mfaEnabled) {            // Generate a secret key for MFA
        const mfaSecret = speakeasy.generateSecret().base32;
    
        console.log("mfaSecret:", mfaSecret);
    
            // Save the secret key to the user model
            user = await userModel.findOneAndUpdate(
              { email: email},
              { mfaEnabled: true, mfaSecret: mfaSecret},
              { new: true }
              
            );
    
         // Generate TOTP
         const mfaCode = speakeasy.totp({
          secret: mfaSecret,
          encoding: "base32",
        });
    
        
        // Send TOTP to user's email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "farahsherif4@gmail.com", // hoto hena el email el hateb3ato menha el email
            pass: "ahlvvpzjaxtllfwx", // hoto hena el App password beta3et your gmail
          },
        });
    
        console.log("Recipient's email:", email);
        console.log("Verification code (TOTP):", mfaCode);
    
        const mailOptions = {
          from: "farahsherif4@gmail.com", // hoto hena nafs el email that you used
          to: email,
          subject: "MFA Setup - Verification Code",
          text: `Your verification code for MFA setup is: ${mfaCode}`,
        };
    
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Error sending email" });
          }
    
          console.log("Email sent:", info.response);
          try {
            await verifyMfa({ body: { mfaCode } }, res, user);
          } catch (verifyError) {
           console.error("Error verifying MFA:", verifyError);
            return res.status(500).json({ message: "Error verifying MFA" });
         }
          
          // Return the secret key to the client for setup
          //return res.status(200).json({ message: "MFA enabled", user, mfaSecret });
          //return res.status(200).json({ message: "MFA enabled" });
        });
      }
      return res
        .status(200)
        .json({ message: "Login successful", user });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  
 

  getCurrentUser: async (req) => {
    try {
      console.log("enter getCurrentUserID");
      // Check if the JWT token is provided in the cookies
      const token = req.cookies.token; // Note: This assumes req is available in the calling scope
      if (!token) {
        throw new Error("Unauthorized");
      }
  
      // Verify the JWT token
      const decoded = jwt.verify(token, secretKey);
      if (!decoded) {
        throw new Error("Unauthorized");
      }
  
      const user = await userModel.findById(decoded.user.userId); // token stores userID automatically, check creation of token
      if (!user) {
        throw new Error("User not found");
      }
  
      // Return the user object
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw new Error("Server error");
    }
  },

};
  module.exports = authController;