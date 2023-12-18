const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const authController = {
  register: async (req, res) => {
    try {
      console.log('hiiiiiiiiii')
      const { firstName, secondName, email, password, username, role, agentType} = req.body;

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
        role,
        agentType
        // issueType
      });

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

      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(405).json({ message: "Incorrect password" });
      }

      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes

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

      const cookie = res.cookie("token", token, {
        expires: expiresAt,
        withCredentials: true,
        httpOnly: false,
        SameSite: 'none',
      });

      console.log("COOKIE VALUE FROM LOGIN: " , cookie)
      
      // Log the constructed cookie
      // console.log('Constructed Cookie:', cookie);
      
      // Send the response with the cookie and JSON data
      return res
        .status(200)
        .json({ message: "Login successful", user });
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