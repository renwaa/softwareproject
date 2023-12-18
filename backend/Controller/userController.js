const userModel = require("../Models/userModel");
const realTimeChatModel = require('../Models/realTimeChatModel');
const {createChat} = require("./chatController");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const FAQModel = require("../Models/FAQModel");
const mongoose = require('mongoose');
const { getCurrentUser } = require("./authController");
const speakeasy = require('speakeasy');
const nodemailer = require("nodemailer");


const userController = {
  // updateUserProfile: async (req, res) => {
  //   try {
  //     const { userId } = req.user;
  //     const { firstName, secondName, password, email, username } = req.body;
  
  //     // Ensure the requester is updating their own profile
  //     if (userId !== req.params.id) {
  //       return res.status(403).json({ message: "Access denied" });
  //     }
  
  //     // Update the password if provided
  //     const updateFields = {
  //       firstName: firstName || "",
  //       secondName: secondName || "",
  //       email: email || "",
  //       username: username || "",
  //     };
  
  //     if (password) {
  //       const hashedPassword = await bcrypt.hash(password, 10);
  //       updateFields.password = hashedPassword;
  //     }
  
  //     // Use findByIdAndUpdate to update the user's profile
  //     const updatedUser = await userModel.findByIdAndUpdate(
  //       req.params.id,
  //       updateFields,
  //       {
  //         new: true, // Return the updated document
  //         runValidators: true, // Run validators for schema-defined validation
  //       }
  //     );
  
  //     if (!updatedUser) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  
  //     return res.status(200).json({ user: updatedUser, msg: "User profile updated successfully" });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
  
  searchFAQ: async (req, res) => {
    try {
      const userQuestion = req.query.q;
  
      const results = await FAQModel.find({ $text: { $search: userQuestion } });
  
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },


rateAgent: async (req, res) => {
  try {
    const { agentId, rating } = req.body;

    const agentUser = await userModel.findOneAndUpdate(
      { _id: agentId },
      { rating: rating },
      { new: true }
    );

    if (!agentUser) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    return res.status(200).json({ success: true, message: 'Rating updated successfully' });
  } catch (error) {
    console.error('Error updating rating:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
},

findAvailableAgent: async function() {
  const agent = await userModel.findOne({ role: 'agent', status: 0 });

  if (agent) {
    return agent._id; // Assuming your user model has an '_id' field
  }

  return null;
},

/* requestRealTimeChat: async (req, res) => {
  try {
    console.log('Entering requestRealTimeChat');
    // Call getCurrentUser internally to get the userId
    const user = await getCurrentUser(req, res);
    const userId = user._id;
    console.log('userId:', userId);

    // Check for an available agent
    const agentId = await userController.findAvailableAgent();
    console.log('agentId:', agentId);

    if (agentId) {
      try {
        console.log('Creating chat...');
        // Perform the logic for creating a real-time chat
        const createChatResponse = await axios.post('http://localhost:3000/api/v1/user/createChat', {
          userId,
          agentId,
        });
        console.log('createChatResponse:', createChatResponse.data);

        // Send a response back to the client
        return res.json({ success: true, message: 'Real-time chat initiated successfully', agentId });
      } catch (createChatError) {
        console.error('Error creating chat:', createChatError);
        // Handle error from createChat API
        return res.status(500).json({ success: false, message: 'Error creating chat' });
      }
    } else {
      console.log('No available agents');
      return res.json({ success: false, message: 'No available agents at the moment' });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}, */

/*createChat: async ({ userId, agentId }) => {
  try {
    if (!userId || !agentId) {
      throw new Error('User ID and Agent ID are required to create a chat.');
    }

    // Check if a chat already exists with the same userId and agentId
    const existingChat = await RealTimeChatModel.findOne({ userId, agentId });
    if (existingChat) {
      throw new Error('Chat already exists for the given User ID and Agent ID.');
    }

    // Create a new chat
    const newChat = new RealTimeChatModel({
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      userId,
      agentId,
      messages: [],
    });

    await newChat.save();
    console.log("Chat initialized successfully");

    return { chatId: newChat._id, msg: "Chat created successfully" };
  } catch (error) {
    // Handle errors
    console.error(error);
    throw new Error("Error creating chat");
  }
},*/


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
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
},

enableMFA: async (req, res) => {
  try {
    
    const { userId, email } = req.user;

    // Generate a secret key for MFA
    const mfaSecret = speakeasy.generateSecret().base32;

    console.log("userId:", userId);
    console.log("mfaSecret:", mfaSecret);

        // Save the secret key to the user model
        user = await userModel.findOneAndUpdate(
          { _id: userId},
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
    
  } catch (error) {
    console.error("Error enabling MFA:", error);
    res.status(500).json({ message: "Server error" });
  }
},

disableMFA: async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you have the authenticated user in req.user

    const user = await userModel.findByIdAndUpdate(
      userId,
      { mfaEnabled: false, mfaSecret: null },
      { new: true }
    );

    res.status(200).json({ message: "MFA disabled", user });
  } catch (error) {
    console.error("Error disabling MFA:", error);
    res.status(500).json({ message: "Server error" });
  }
},

};

//   getAllUsers: async (req, res) => {
//     try {
//       // Check the user's role before allowing access to all users
//       if (req.user.role !== 'admin') {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const users = await userModel.find();
//       return res.status(200).json(users);
//     } catch (e) {
//       return res.status(500).json({ message: e.message });
//     }
//   },

//   getUser: async (req, res) => {
//     try {
//       // Check the user's role before allowing access to a specific user
//       if (
//         req.user.role !== 'admin' &&
//         req.user.userId !== req.params.id
//       ) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const user = await userModel.findById(req.params.id);
//       return res.status(200).json(user);
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   },

//   updateUser: async (req, res) => {
//     try {
//       // Check the user's role before allowing the update
//       if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const user = await userModel.findByIdAndUpdate(
//         req.params.id,
//         { name: req.body.name },
//         {
//           new: true,
//         }
//       );
//       return res.status(200).json({ user, msg: "User updated successfully" });
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   },

//   deleteUser: async (req, res) => {
//     try {
//       // Check the user's role before allowing the deletion
//       if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const user = await userModel.findByIdAndDelete(req.params.id);
//       return res.status(200).json({ user, msg: "User deleted successfully" });
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   },
// };

 module.exports = userController;
 