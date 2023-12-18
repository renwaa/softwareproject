const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel")
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

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
        role, // Assign the provided role
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
      const user = await userModel.findOne({ email });
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
        .json({ message: "Login successful", user });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
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
        return res.status(404).json({ message: "User not found" , token , decoded });
      }

      // Return the user object
      return user ;
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ message: "Server error" });
    }
 },    



};
  module.exports = authController;
