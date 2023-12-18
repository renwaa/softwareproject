const userModel = require("../Models/userModel");
//const agentModel = require("../Models/agentModel");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const path = require('path');

const adminController = {
    setAgent: async (req,res) => {
        try {
            const userId=req.body.userId;
            if(!userId){
                return res.status(404).json({ error: 'no userId' });
            }
            const user= await userModel.findByIdAndUpdate(userId,{role:'Agent'},{new:true});
            const newAgent = new agentModel({
               firstName:user.firstName,
               secondName:user.secondName,
              password:user.password,
               email:user.email,
               username:user.username,
               agentType:"agent1",
               status: "0",
               rating: "8",
            });
            await newAgent.save();
            console.log(user);
            if(!user){
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(201).json({ message: "User is now agent" });            
        } catch (error) {
            console.error('Error setting Agent:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
}
module.exports = adminController;
