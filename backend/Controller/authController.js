 const userModel = require("../Models/userModel");
const agentModel = require("../Models/agentModel");
const sessionModel = require("../Models/sessionModel");
const speakeasy = require('speakeasy');
const nodemailer = require("nodemailer");
const { verifyMfa } = require("./MFAController");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const mfaController = require("./MFAController");

const authController = {
  register: async (req, res) => {
    const { firstName, secondName, email, password, username, mfaEnabled } = req.body;
    try {
      const existingUser = await userModel.findOne({ email });
      
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new userModel({
        firstName,
        secondName,
        email,
        password: hashedPassword,
        username,
        mfaEnabled, 
        role: "user",
        notify : false,
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
 },
 login: async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    let client = await userModel.findOne({ email });
    let agent = await agentModel.findOne({ email });

    if (!client && !agent) {
      return res.status(404).json({ message: "Email not found" });
    }

    if(!client){
      user = agent;
    }else{
      user = client;
    }

    // Check if the password is correct
    console.log("password" , password);
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(405).json({ message: "Incorrect password" });
    }

    // Check if MFA is enabled for the user
    if (user.mfaEnabled) {
      try {

        // Generate a secret key for MFA
        const mfaSecret = speakeasy.generateSecret().base32;

        // Save the secret key and mfaCode to the user model
        user = await userModel.findOneAndUpdate(
          { email: email },
          {
            mfaEnabled: true,
            mfaSecret: mfaSecret,
            mfaCode: speakeasy.totp({
              secret: mfaSecret,
              encoding: "base32",
            }),
          },
          { new: true }
        );

        // Send TOTP to user's email
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false,
          

          auth: {
            user: "softwareDeskHelp@outlook.com",
            pass: "softwareDeskHelp2003",
          },
        });
        const mailOptions = {
          from: "softwareDeskHelp@outlook.com",
          to: email,
          subject: "MFA Setup - Verification Code",
          text: 'Your verification code for MFA setup is: ${user.mfaCode}'
        };
        console.log("888888888")
        // Send email and handle response
        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "being redirected to verify MFA", user });
      } catch (mfaError) {
        console.error("Error setting up MFA:", mfaError);
        return res.status(500).json({ message: "Error setting up MFA" });
      }
      
    } else {
      // Continue with your existing login logic for users without MFA
      try {
        const currentDateTime = new Date();
        const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes

        // Generate a JWT token
        const token = jwt.sign(
          { user: { userId: user._id, role: user.role } },
          secretKey,
          {
            expiresIn: 3 * 60 * 60 * 1000,
          }
        );

        let newSession = new sessionModel({
          userId: user._id,
          token,
          expiresAt: expiresAt,
        });
        await newSession.save();

        console.log;

        return res
          .cookie("token", token, {
            expires: expiresAt,
            withCredentials: true,
            httpOnly: false,
            SameSite: 'none',
          })
          .status(200)
          .json({ message: "Login successful", user, token });
      } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
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
      const agent = await agentModel.findById(decoded.user.userId); 
     
      if( !user && !agent ){
        throw new Error ("user not found!")
      }else if(user){
        console.log("user from getCurrentUser");
        return user;
      }else if(agent){
        console.log("agent from getCurrentUser");
        return agent; 
      }

    } catch (error) {
      console.error("Error getting current user:", error);
      throw new Error("Server error");
    }
  },
  
 
};
  module.exports = authController;
