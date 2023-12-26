const { default: mongoose } = require("mongoose");
const FAQModel = require("../Models/FAQModel");
const ticketModel = require("../Models/ticketModel");
const userModel = require("../Models/userModel");
const { getCurrentUser } = require("./authController");

const agentController = {
    addFAQ: async(req , res) =>{
        try{
    
          const fq =  { question , answer } = req.body;
    
          if(await FAQModel.findOne({fq})){
            return res.status(409).json({ message: "FAQ already exists" });
          }
    
          const newFAQ = new FAQModel({
            question,
            answer,
          });
    
          await newFAQ.save();
          res.status(201).json({ message: " FAQ added successfully" });
    
        } catch(error){
          return res.status(500).json({ message: error.message });
        }
      },

    deleteFAQ: async(req, res) => {
        try {
    
            const id = req.params.id;
    
            const deletedFAQ = await FAQModel.deleteOne({ _id: id });
    
            if (deletedFAQ.deletedCount === 0) {
                return res.status(404).json({ message: "FAQ not found" });
            }
    
            res.status(200).json({ message: "FAQ deleted successfully" });
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },


   

    updateTicket: async (req, res) => {
      try {
        agent = await getCurrentUser(req);
        // console.log("agent", agent);
    
        let id = req.params.id;
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

            // Check if the user has an email address
    if (!user.email) {
      return res.status(500).json({ message: 'User does not have an email address' });
    }

    // Notify user by email
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: "softwareDeskHelp@outlook.com",
        pass: "softwareDeskHelp2003",
      },
    });

    const mailOptions = {
      from: 'softwareDeskHelp@outlook.com',
      to: user.email,
      subject: 'Ticket Update Notification',
      text: Dear `${user.firstName} ${user.secondName},\n\nYour ticket has been updated. Please check your account to view your ticket`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
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
    

    
      
 };

module.exports = agentController;
    
