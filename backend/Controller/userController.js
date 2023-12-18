const userModel = require("../Models/userModel");
const ticketModel = require("../Models/ticketModel");
const sessionModel = require("../Models/sessionModel");
const FAQsModel = require("../Models/FAQsModel");
const { getCurrentUser } = require("./authController");
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');


const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const userController = {
  register: async (req, res) => {
    try {
      const { email, password, displayName, role } = req.body;

      // Check if the user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new userModel({
        email,
        password: hashedPassword,
        displayName,
        role,
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
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
      if (user.mfaEnabled) {
        const mfaSecret = speakeasy.generateSecret().base32;
  
        console.log("email:", email);
        console.log("mfaSecret:", mfaSecret);
  
        // Save the secret key to the user model
        user = await userModel.findOneAndUpdate(
          { email: email },
          { mfaEnabled: true, mfaSecret: mfaSecret },
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
            user: "", // hoto hena el email el hateb3ato menha el email
            pass: "", // hoto hena el App password beta3et your gmail
          },
        });
  
        console.log("Recipient's email:", email);
        console.log("Verification code (TOTP):", mfaCode);
  
        const mailOptions = {
          from: "", // hoto hena nafs el email that you used
          to: email,
          subject: "MFA Setup - Verification Code",
          text: `Your verification code for MFA setup is: ${mfaCode}`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Error sending email" });
          }
  
          console.log("Email sent:", info.response);
  
          // Return the secret key to the client for setup
          res.status(200).json({ message: "MFA enabled", user, mfaSecret });
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
   verifyMFA : async (req, res) => {
    try {
      const MFAcode = req.body.totp;
    if (!MFAcode) {
      return res.status(405).json({ message: "MFA code not provided" });
    }
    const mfaSecret = user.mfaSecret;
    const mfaVerified = speakeasy.totp.verify({
      secret: mfaSecret,
      encoding: "base32",
      token: mfaCode,
    });
    const currentDateTime = new Date();
        const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
  
        // Generate a JWT token
        const token = jwt.sign(
          { user: { userId: user._id, role: user.role, email: user.email } },
          secretKey,
          {
            expiresIn: 3 * 60 * 60,
          }
        );
  
        // If MFA is successful, set the MFA token in the cookie
        if (user.mfaEnabled) {
          const mfaToken = speakeasy.totp({
            secret: user.mfaSecret,
            encoding: "base32",
          });
  
          res.cookie("mfaToken", mfaToken, {
            httpOnly: false,
            SameSite: "none",
          });
        }
  
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

    if (!mfaVerified) {
      return res.status(403).json({ message: "Invalid MFA code" });
    }
    } catch (error) {
      res.status(500).json({ message:"internal server error"});
    }
  },



   

  // login: async (req, res) => {
  //   try {
  //     const { email, password } = req.body;

  //     // Find the user by email
  //     const user = await userModel.findOne({ email });
  //     if (!user) {
  //       return res.status(404).json({ message: "email not found" });
  //     }

  //     console.log("password: ", user.password);
  //     // Check if the password is correct

  //     const passwordMatch = await bcrypt.compare(password, user.password);
  //     if (!passwordMatch) {
  //       return res.status(405).json({ message: "incorect password" });
  //     }

  //     const currentDateTime = new Date();
  //     const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
  //     // Generate a JWT token
  //     const token = jwt.sign(
  //       { user: { userId: user._id, role: user.role } },
  //       secretKey,
  //       {
  //         expiresIn: 3 * 60 * 60,
  //       }
  //     );
  //     let newSession = new sessionModel({
  //       userId: user._id,
  //       token,
  //       expiresAt: expiresAt,
  //     });
  //     await newSession.save();
  //     return res
  //       .cookie("token", token, {
  //         expires: expiresAt,
  //         withCredentials: true,
  //         httpOnly: false,
  //         SameSite: 'none'
  //       })
  //       .status(200)
  //       .json({ message: "login successfully", user });
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // },
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find();
      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      console.log("enter getCurrentUserID")
      // Check if the JWT token is provided in the cookies
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify the JWT token
      const decoded = jwt.verify(token, secretKey);
      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Find the user by id from the decoded JWT token
      // const id = decoded.userId;
      // if (!id) {
      //   return res.status(404).json({ message: "empty" });
      // }

      const user = await userModel.findById(decoded.user.userId);  //token stores userID automatically , check creation of token 
      if (!user) {
        return res.status(404).json({ message: "User not found", token, decoded });
      }

      // Return the user object
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  createNewTicket: async (req, res) => {
    try {
      console.log("Creating new ticket");
      // Assuming getCurrentUser returns a Promise
      const user = await getCurrentUser(req, res);
      const userId = user._id;
      const ticket = new ticketModel({
        type: req.body.type,
        subCategory: req.body.subCategory,
        priority: req.body.priority,
        issueDescription: req.body.issueDescription,
        userId: userId,
        status: "open",
      });
      await ticket.save();

      // Fetch user information using userId
      //const user = await userModel.findById(userId);
      console.log("2");

      // Send a single response with all the data
      return res.status(201).json({
        message: 'Support ticket created successfully',
        ticket: ticket,
        user: user, // Include user information in the response
      });

    } catch (error) {
      // Handle errors appropriately
      console.error("Error creating support ticket:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  searchFAQ: async (req, res) => {
    try {
      console.log("hi");
      const userQuestion = req.query.q;

      const results = await FAQsModel.find({ $text: { $search: userQuestion } });

      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  findAvailableAgent: async function () {
    const agent = await userModel.findOne({ role: 'agent', status: 0 });

    if (agent) {
      return agent._id; // Assuming your user model has an '_id' field
    }

    return null;
  },
  requestRealTimeChat: async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      const userId = user._id;


           // Check for an available agent
      const agentId = await userController.findAvailableAgent();


      if (agentId) {
        // Perform the logic for creating a real-time chat
        await createChat(userId, agentId);

        // Send a response back to the client
        return res.status(201).json({ success: true, message: 'Real-time chat initiated successfully', agentId });
      } else {
        return res.status(500).json({ success: false, message: 'No available agents at the moment' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

};
module.exports = userController;