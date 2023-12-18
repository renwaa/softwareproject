const userModel = require("../Models/agentModel");
const sessionModel = require("../Models/sessionModel");
const ticketModel = require("../Models/ticketModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const path = require('path');

const agentController = {
    login: async (req, res) => {
        try {
          const { email, password } = req.body;
    
          // Find the user by email
          const user = await userModel.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: "email not found" });
          }
    
          console.log("password: ", user.password);
          // Check if the password is correct
    
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(405).json({ message: "incorect password" });
          }
          const currentDateTime = new Date();
          const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
          // Generate a JWT token
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
          return res
            .cookie("token", token, {
              expires: expiresAt,
              withCredentials: true,
              httpOnly: false,
              SameSite:'none'
            })
            .status(200)
            .json({ message: "login successfully", user });
        } catch (error) {
          console.error("Error logging in:", error);
          res.status(500).json({ message: "Server error" });
        }
      },
    updateTicket: async (req, res) => {
        try {
            const { ticketId } = req.params.ticketId;
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }
            const status = await ticketModel.findById(ticketId);
            if (status === 'open') {
                const reply = req.body.reply;
                await ticketModel.findByIdAndUpdate(ticketId, { status: 'closed' });
                return res.status(200).json('Ticket updated successfully');
            }
            const updateDetails = req.body.updateDetails;
            const ticket = await getDetails(ticketId);
        } catch (error) {
            console.error('Error updating ticket:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    closeTicket: async (req, res) => {
        try {
            const { ticketId } = req.params; 
            const ticket = await ticketModel.findById(ticketId);

            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            const status = ticket.status;
            if(status == 'closed'){
                return res.status(404).json({ error: 'Ticket is already closed' });
            }

            await ticketModel.findByIdAndUpdate(ticketId, { status: 'closed' });
            await ticketModel.findByIdAndUpdate(ticketId, { endedAt: new Date() });


            return res.status(200).json({ message: 'Ticket closed successfully', status: 'closed' });
        } catch (error) {
            console.error('Error closing ticket:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    searchCategory: async (req, res) =>{
        try {
          const type =req.body.type;
         // const ticket = await ticketModel.find(type);
          if(!ticket){
            return res.status(404).json({message:" Did not find ticket"});
          }
          const ticketType = ticket.type;
          let categoryQuestions;
          switch (ticketType) {
            case 'Software':
              categoryQuestions = await FAQModel.find({ type: 'Software' });
              break;
            case 'Hardware':
              categoryQuestions = await FAQModel.find({ type: 'Hardware' });
              break;
            case 'Networks':
              categoryQuestions = await FAQModel.find({ type: 'Networks' });
              break;
            default:
              return res.status(400).json({ message: 'Invalid ticket type' });
          }
          res.status(200).json({ ticket, categoryQuestions });
    
          // get ticket using ID 
          // check the type 
          // if software get all software questions, if hardware get all hardware questions
          // if network get all network questions and then display all 
          
        } catch (error) {
          console.error("Error getting category questions",error);
          return res.status(500).json({message:"Internal server error"}); 
        }
      },

};
module.exports = agentController;
