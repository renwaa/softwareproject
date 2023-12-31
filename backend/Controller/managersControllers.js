const {getCurrentUser} = require("./authController");
const analyticsModel = require("../Models/analyticsModel");
const reportModel = require("../Models/reportModel");
const ticketModel = require("../Models/ticketModel");
const agentModel = require("../Models/agentModel");
require('dotenv').config();


const managerController = {
    generateReportPerTicket: async (req, res) => {
      console.log("HEREEE!???");

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
deleteReport: async (req, res) => {
  try {
      const reportId = req.params.reportId;

      // Find the report by ID and delete it
      const deletedReport = await reportModel.findByIdAndDelete(reportId);

      if (!deletedReport) {
          return res.status(404).json({ message: 'Report not found' });
      }

      return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
},
getReportById: async (req, res) => {
    try {
        const id = req.params.reportId;
        const report = await reportModel.findById(id);
  
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
},
getAllReports: async(req,res)=>{
  try{
    const reports = await reportModel.find();
    return res.status(200).json(reports);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
},
getTicketById: async (req, res) => {
  try {
    const id = req.params.ticketId;
    const ticket = await ticketModel.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ ticket }); // Wrap ticket in an object with key 'ticket'
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

viewTickets: async (req, res) => {
    try {
      console.log("1")
        const tickets = await ticketModel.find();
        res.status(200).json({ tickets });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  },
  viewAnalytics: async (req, res) => {
    console.log("analytics 1")
    try {
        const analytics = new analyticsModel({

            ticketStatusAnalytics: {
                open: await ticketModel.countDocuments({ status: 'open' }),
                pending: await ticketModel.countDocuments({ status: 'pending' }),
                closed: await ticketModel.countDocuments({ status: 'close' }),
            },
            ticketPriorityAnalytics: {
                high: await ticketModel.countDocuments({ priority: 'high' }),
                medium: await ticketModel.countDocuments({ priority: 'medium' }),
                low: await ticketModel.countDocuments({ priority: 'low' }),
            },
            ticketTypeAnalytics: {
                software: await ticketModel.countDocuments({ type: 'Software' }),
                hardware: await ticketModel.countDocuments({ type: 'Hardware' }),
                networks: await ticketModel.countDocuments({ type: 'Networks' }),
            },
        });
        await analytics.save();
        res.status(200).json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},
deleteteAnalytics: async (req, res) => {
  try {
      const analyticsId = req.params.analyticsId;
      const deletedAnalytics = await analyticsModel.findByIdAndDelete(analyticsId);
      if (!deletedAnalytics) {
          return res.status(404).json({ message: 'Analytics not found' });
      }

      return res.status(200).json({ message: 'Analytics deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }

},
 
};

module.exports = managerController;