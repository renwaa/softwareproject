const userModel = require("../Models/userModel");
const ticketModel = require("../Models/ticketModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey =process.env.SECRET_KEY ;
const bcrypt = require("bcrypt");
const agentController = {
  closeTicket: async (req, res) => {
    try {
        const { ticketId } = req.params;

        const existingTicket = await ticketModel.findOne({ _id: ticketId });
        if (existingTicket.status === 'closed') {
          return res.status(400).json({ error: 'Ticket is already closed' });
        }  
        // Assuming you have a "status" field in your ticket model
        const updatedTicket = await ticketModel.findOneAndUpdate(
            { _id: ticketId },
            { $set: { status: 'closed', endedAt: new Date() } },
            { new: true } // Return the updated document
        );

        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        res.status(200).json({ message: 'Ticket closed successfully', ticket: updatedTicket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
},
    getAllTickets: async (req, res) => {
        try {
            const tickets = await ticketModel.find();
            return res.status(200).json({ tickets });
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
      
    },
    getAllOpenTickets: async (req, res) => {
      try {
       const tickets = await ticketModel.find({ status: 'Open' });
       const openTicketsCount = tickets.length;
       console.log("tickets count:", openTicketsCount)
        return res.status(200).json({ tickets });
      
      } catch (error) {
           return res.status(500).json({ message: error.message });
      }
      },
      
};
module.exports = agentController;