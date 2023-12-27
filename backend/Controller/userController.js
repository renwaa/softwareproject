const FAQModel = require("../Models/FAQModel");
const ticketModel = require("../Models/ticketModel");
const workflowModel = require("../Models/workflowModel");
const userModel = require("../Models/userModel");
const { getCurrentUser } = require("./authController");
const { createChat } = require("./realTimeChatController")
const sessionModel = require("../Models/sessionModel");
const agentModel = require("../Models/agentModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const userController={

  getUserInfo: async (req, res) => {
    try {
      const userId = req.params.id; // Assuming you pass the user ID as a URL parameter
      const user = await userModel.findById(userId).select('-password -mfaSecret -mfaCode'); // Exclude sensitive fields
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  
  updateUserProfile: async (req, res) => {
    try {
      const { userId, role } = req.user;
      const { firstName, secondName, email, username } = req.body;

      if (userId !== req.params.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Fetch the existing user data from userModel or agentModel based on role
      let existingUserData;
      if (role === 'agent') {
        existingUserData = await agentModel.findById(req.params.id);
      } else {
        existingUserData = await userModel.findById(req.params.id);
      }

      if (!existingUserData) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user or agent fields
      const updatedFields = {
        firstName: firstName || existingUserData.firstName,
        secondName: secondName || existingUserData.secondName,
        email: email || existingUserData.email,
        username: username || existingUserData.username,
        // Include additional fields for agents, if applicable
      };

      let updatedData;
      if (role === 'agent') {
        updatedData = await agentModel.findByIdAndUpdate(
          req.params.id,
          updatedFields,
          { new: true, runValidators: true }
        );
      } else {
        updatedData = await userModel.findByIdAndUpdate(
          req.params.id,
          updatedFields,
          { new: true, runValidators: true }
        );
      }

      if (!updatedData) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        user: updatedData,
        msg: "User profile updated successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  
  getFAQs: async (req, res) => {
    console.log("called");
    try {
      const token = req.cookies.token
      console.log("TOKEN FROM FAQ: " , token);
      const faqs = await FAQModel.find();
  
      // Check if there are FAQs
      if (faqs.length === 0) {
        return res.status(404).json({ message: "No FAQs found" });
      }
  
      return res.status(200).json({ faqs });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  searchFAQ: async (req, res) => {
    try {
      const searchText = req.query.search || '';
      const query = {
        $or: [
          { 'question': { $regex: searchText, $options: 'i' } },
          { 'answer': { $regex: searchText, $options: 'i' } },
        ],
      };
      const faqs = await FAQModel.find(query);
      res.send(faqs);
   } catch (error) {
      res.status(500).send(error);
   }
 },
createNewTicket: async (req, res) => {
  try {
    // Assuming getCurrentUser returns a Promise
    const userId = req.body.userId;

    const ticket = new ticketModel({
      name : req.body.name,
      type: req.body.type,
      subCategory: req.body.subCategory,
      priority: req.body.priority,
      userId: userId,
      status: "open",
    });
    

    const newTicket = await ticket.save();

    // Send a single response with all the data
    return res.status(201).json({
      message: 'Support ticket created successfully',
      ticket: newTicket,
      user: user, // Include user information in the response
    });
    
  } catch (error) {
    // Handle errors appropriately
    console.error("Error creating support ticket:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
},
emailNotification : async(req , res) => {
  try{
    const userId =req.params.userId;
    const user = await userModel.findOne({_id: userId })
   if(user.notify){
      return res.status(201).json({message: 'Your support ticket has been updated. Please check ${user.email} for updates!' , state : true});
    }else{
      return res.status(201).json({message: 'You do not have any updates yet. We are working on it , we promise to update you very soon' , state : false});

    }

} catch (error) {
  console.error("Error getting current user:", error);
  return res.status(500).json({ message: "Internal Server Error" });
}
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
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
},
findAvailableAgent: async function() {
  const agent = await userModel.findOne({ role: 'agent', status: 0 });

  if (agent) {
    return agent._id; // Assuming your user model has an '_id' field
  }

  return null;
},

rateAgent: async (req, res) => {
  try {
    const user = await getCurrentUser(req, res);
    const userId = user._id;
    const { ticketId } = req.params;
    const newRating = req.body.rating;

    console.log(ticketId);

    const ticket = await ticketModel.findById(ticketId);
    console.log("ticket : ", ticket);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    console.log("hey");

    if (ticket.status !== 'close') {
      return res.status(400).json({ error: 'Cannot rate an open ticket' });
    }
    
    console.log("Finding agent with ID:", ticket.agentId);
    const agent = await agentModel.findById(ticket.agentId).populate('tickets');
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    console.log("agent",agent);

    // Calculate the new average rating
    let totalRatings = agent.tickets.length; // Total number of ratings based on tickets
    let currentAverageRating = agent.rating || 0;
    let newAverageRating = (currentAverageRating * totalRatings + newRating) / (totalRatings + 1);

    // Update agent's rating
    agent.rating = newAverageRating;
    await agent.save();

    return res.status(200).json({ message: 'Agent rated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},
viewMyTickets: async (req, res) => {
  try {
    console.log("12345678");
    const userId = req.params;
    console.log("UserId:", userId.userId); // Debugging line to check userId value

    // Update the query to match the correct field name in the schema
    
    const myTickets = await ticketModel.find({ userId: userId.userId });
    console.log("user tickets: " , myTickets);

    res.status(200).json({ myTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
},
  getWorkflow: async (req, res) => {
    try{
        const {subCategory} = req.params;

        const workflow = await workflowModel.findOne({ 'subCategory': { $in: [subCategory] } });
        if (!workflow) {
            res.status(404).json({ error: 'Workflow not found for the provided ticket' });
            return;
          }
        console.log(workflow);
        res.status(200).json({ message : "a custom work was found" , workflow});
    }catch (error) {
  return res.status(500).json({ message: error.message });
  }
  },
resetPassword: async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Check if the user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches
    const isPasswordMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Check if the new password is the same as the old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }
    // Update the user's password in the database
    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
},
  



};

module.exports = userController;