const userModel = require("../Models/userModel");
const agentModel = require("../Models/agentModel");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const authController = {
  register: async (req, res) => {
    const { firstName, secondName, email, password, username, role, agentType } = req.body;
    try {
      if (['agent'].includes(role)) {
        const emailAgent = await agentModel.findOne({ email });
        if (emailAgent) {
          return res.status(409).json({ message: "Agent already exists" });
        }

        if (!['agent1', 'agent2', 'agent3'].includes(agentType)) {
          return res.status(400).json({ message: "Invalid agentType for agent role" });
        }

        const existingAgent = await agentModel.findOne({ agentType });
        if (existingAgent) {
          return res.status(409).json({ message: `${agentType} already exists` });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided role
        const newAgent = new agentModel({
          firstName,
          secondName,
          email,
          password: hashedPassword,
          username,
          role,
          agentType,
          status: 0,
        });

        // Save the user to the database
        await newAgent.save();

        res.status(201).json({ message: "Agent registered successfully" });

      } else if (["user", "manager", "admins"].includes(role)) {

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
          role,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

      } else {
        return res.status(400).json({ message: "Invalid role" });
      }
    } catch (error) {
      console.error("Error registering agent:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await agentModel.findOne({ email }) || await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(405).json({ message: "Incorrect password" });
      }

      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes

      // Generate a JWT token
      const token = jwt.sign(
        { user: { userId: user._id, role: user.role } },
        secretKey,
        {
          expiresIn: 3 * 60 * 60,
        }
      );

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
          SameSite: 'none',
        })
        .status(200)
        .json({ message: "Login successful", user, token });
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

      if (!user && !agent) {
        throw new Error("User not found!");
      } else if (user) {
        console.log("user from getCurrentUser");
        return user;
      } else if (agent) {
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
