const analyticsModel = require("../Models/analyticsModel");
const reportModel = require("../Models/reportModel");
const ticketModel = require("../Models/ticketModel");
const agentModel = require("../Models/agentModel");
const {getCurrentUser} = require("./authController");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const managerController = {
    // generateReport: async (req, res) => {
    //    try{
    //     const manager = await getCurrentUser(req, res);
    //     const managerId = manager._id;
    //     const tickets = await ticketModel.find();

    //     const report = tickets.map(ticket => {
    //         const reportEntry = {
    //           ticketId: ticket._id,
    //           priority: ticket.priority,
    //           type: ticket.type,
    //           subCategory: ticket.subCategory,
    //           status: ticket.status,
    //           resolutionTime: ticket.endedAt - ticket.createdAt, // Include resolution time for all tickets
    //         };
            
    //           return reportEntry;
    //         });
    //         res.status(200).json({ success: true, report });

    //    }
    //    catch(error){
    //     res.status(500).json({ success: false, error: 'Internal Server Error' });

    //    }

    // },
    generateReportPerTicket: async (req, res) => {
      try {
           const manager = await getCurrentUser(req, res);
           const managerId = manager._id;
           const id = req.params.ticketId;
           const ticket = await ticketModel.findById(id);
           console.log(ticket);
     
           let reportData = {
               ticketId: ticket._id,
               agentId: ticket.agentId,
               ticketStatus: ticket.status,
           };
           //console.log(reportData);
           
           // Check if the ticket status is closed
           if (ticket.status === 'close') {
               // Include resolution time and agent rating for closed tickets
               let resolutionTime = new Date(ticket.updatedAt);
               resolutionTime.setMilliseconds(resolutionTime.getMilliseconds() - new Date(ticket.createdAt).getMilliseconds());
               reportData.resolutionTime = resolutionTime;
     
               const agent = await agentModel.findById(ticket.agentId);
               reportData.agentRating = agent.rating;
               reportData.ticketStatus = ticket.status;
               //console.log(agent)
           }
           else if(ticket.status === 'open' || ticket.status === 'pending'){
             reportData.resolutionTime = ticket.createdAt;
             reportData.ticketStatus = ticket.status;
           }
     
           const report = new reportModel(reportData);
           await report.save(report);
           //console.log(report)
     
           return res.status(200).json(report);
      } catch (error) {
           res.status(500).json({ message: error.message });
      }
     },
   
getAllClosedTickets: async (req, res) => {
    try {
      const tickets = await ticketModel.find({status: 'closed'});
     return tickets;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  viewAnalytics: async(req,res)=>{
    try{
      const ticketCounts={
      open: await ticketModel.countDocuments({ status: 'open' }),
      pending: await ticketModel.countDocuments({ status: 'pending' }),
      closed: await ticketModel.countDocuments({ status: 'close' }),
      highPriority: await ticketModel.countDocuments({ priority: 'high' }),
      mediumPriority: await ticketModel.countDocuments({ priority: 'medium' }),
      lowPriority: await ticketModel.countDocuments({ priority: 'low' }),
      softwareTickets: await ticketModel.countDocuments({ type: 'Software' }),
      hardwareTickets: await ticketModel.countDocuments({ type: 'Hardware' }),
      networkTickets: await ticketModel.countDocuments({ type: 'Networks' }),
      };
      res.status(200).json(ticketCounts);
    }
    catch(error){
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

    


  

 
};

module.exports = managerController;