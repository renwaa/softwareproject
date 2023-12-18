const userModel = require("../Models/userModel");
const ticketModel = require("../Models/ticketModel");
const sessionModel = require("../Models/sessionModel");
const FAQModel= require("../Models/FAQModels");
const agentModel = require("../Models/agentModel");
const {getCurrentUser} = require("./authController");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const userController = {
  createNewTicket: async (req, res) => {
    try {
      // Assuming getCurrentUser returns a Promise
      const user = await getCurrentUser(req, res);
      const userId = user._id;
      const ticket = new ticketModel({
        type: req.body.type,
        subCategory: req.body.subCategory,
        priority: req.body.priority,
        userId: userId,
        status: "open",
      });
      const newTicket = await ticket.save();
  
      // Fetch user information using userId
      //const user = await userModel.findById(userId);
      console.log("2");
  
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
