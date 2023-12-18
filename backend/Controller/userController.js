const FAQModel = require("../Models/FAQModel");
const ticketModel = require("../Models/ticketModel");
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
  getFAQs: async (req, res) => {
    try {
     
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
    const user = await getCurrentUser(req);
    const userId = user._id;

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
    const user =await getCurrentUser(req);

   if(user.notify){
      return res.status(201).json({message: 'Your support ticket has been updated. Please check ${user.email} for updates!'});
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


userRate : async (req, res) => {
    try {
      const user = await getCurrentUser(req, res);
      const userId = user._id;
      const { ticketId } = req.params;
      const { rating } = req.body;

      console.log(ticketId)
     
      const ticket = await ticketModel.findById(ticketId);
      console.log("ticket : ", ticket);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      if (ticket.status !== 'close') {
        return res.status(400).json({ error: 'Cannot rate an open ticket' });
      }
      console.log(ticket)
      const agent = await agentModel.findById(ticket.agentId);
  
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      agent.rating = rating;
      await agent.save();
  
      return res.status(200).json({ message: 'Agent rated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  



};

module.exports = userController;
