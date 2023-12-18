const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel")
const ticketModel = require("../Models/ticketModel");
const agentModel = require("../Models/agentModel");
const {getCurrentUser} = require("./authController");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const agentController = {
  updateTicket: async (req, res) => {
    try {
      agent = await getCurrentUser(req);
      console.log("agent", agent);
  
      let id = req.params.ticketId;
      console.log("id:", id);
  
      const ticket = await ticketModel.findById(id);
      
  
      const sol = req.body.solution;
      let ticketArray = [];
      ticketArray = agent.tickets;
      console.log("ticketArray" , ticketArray)
  
      // Check if the ticket ID is in the agent's ticketArray
      if (!ticketArray.includes(id)) {
        return res.status(404).send("Agent does not have this ticket");
      }
  
      if (!ticket) {
        return res.status(500).send("This ticket does not exist");
      }
  
      if (ticket.status == "close" || ticket.status == "open") {
        return res
          .status(500)
          .send(
            "Ticket status must be pending, this ticket was either open or already closed"
          );
      }
  
      // Update ticket content
      ticket.solution = sol;
      ticket.status = "close";
      await ticket.save();
  
      
      // Remove the closed ticket from ticketArray
      const updatedTicketArray = ticketArray.filter((ticketId) => ticketId.toString() !== id);

      // let updatedTicketArray = [];
      // ticketArray.forEach(ticket => {
      //   if(ticket.toString()!== id ){
      //    updatedTicketArray.push(ticket);
      //   }
        
      // });
      console.log(updatedTicketArray);
      agent.tickets = updatedTicketArray;
      await agent.save();
  
      // Send email notification
      const userId = ticket.userId;
      const user = await userModel.findById(userId);
  
      user.notify = true;
      await user.save();
  
      return res.status(200).json({
        message: "Ticket updated successfully",
        ticket: ticket,
        user: user,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
//     updateTicket: async(req,res)=>{
//       try{
//         const ticket = new ticketModel({
//           ticketId: req.params.ticketId,
//           status: req.body.status,
//           solution: req.body.solution,
//         });
//         const updatedTicket = await ticketModel.findOneAndUpdate(
//           {_id: ticket.ticketId},
//           {status: ticket.status},
//           {solution: ticket.solution},
//           {new : true}
//         );
//         res.status(200).json({updatedTicket});
//       }
//       catch(error){
//         res.status(500).json({message: error.message});

//       }     
// }
};

module.exports = agentController;