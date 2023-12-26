const RealTimeChatModel = require('../Models/realTimeChatModel');
const messageModel = require('../Models/messageModel');
const agentModel = require('../Models/agentModel');
const userModel = require('../Models/userModel');

 
const mongoose = require('mongoose');

const realTimeChatController = {

  findAvailableAgent: async function() {
    const agent = await agentModel.findOne({ role: 'agent', status: 0 });  
    if (agent) {
      return agent._id;
    }
  
    return null;
  },

  requestRealTimeChat: async (req, res) => {
    try {
      const userId = req.body.userId;
      const agentId = await realTimeChatController.findAvailableAgent();

      if (agentId) {
        const agent = await agentModel.findOne({ _id: agentId });   

        if (agent) {
          // Update the agent's status to 1
          agent.status = 1;
          await agent.save();
          console.log("Agent status updated to 1");
        } else {
          console.error("Agent not found for the given Agent ID");
        }
    
        // Create a new chat
        const newChat = new RealTimeChatModel({
          _id: new mongoose.Types.ObjectId(),
          createdAt: new Date(),
          userId,
          agentId,
          messages: [],
        });
  
    
        await newChat.save();
        return res.status(201).json({ success: true, message:"Chat created successfully", chatId: newChat._id});
      } else {
        return res.status(500).json({ success: false, message: 'No available agents at the moment' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  endChat: async (req, res) => {
    try {
      const { chatId } = req.params;

      const chat = await RealTimeChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
      }
      const agentId = chat.agentId;
      const agent = await agentModel.findById(agentId);
      agent.status =0;
      await agent.save();

      chat.endedAt = new Date();
      await chat.save();

      return res.status(200).json({ msg: "Chat ended successfully" });
    } catch (error) {
      return res.status(500).json({ message: 'Error ending chat: ' + error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { chatId, content , role , userId } = req.body;
      const createdBy = userId; // Assuming user is authenticated
      console.log("1234567890");
      let name ="";
      if(role=== 'agent'){
        console.log("1");
        const agent = await agentModel.findById(createdBy);
         name = agent.agentType;
      }else if (role ==='user'){
        console.log("2");
        const user = await userModel.findById(createdBy);
         name = user.firstName;
      }
      console.log("name" , name);
      const newMessage = new messageModel({
        _id: new mongoose.Types.ObjectId(),
        chatId,
        content,
        createdAt: new Date(),
        createdBy,
        creatorName:name,
      });
      console.log("111111")
      await newMessage.save();
      console.log("222222222")

      // Update the chat with the new message
      await RealTimeChatModel.findByIdAndUpdate(chatId, {
        $push: { messages: newMessage._id },
      });

      console.log("333333333")

      return res.status(200).json({ msg: "Message sent successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
receiveMessage: async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log("RECEIVE MESSAGE BACKEND");
    console.log("chat id" , chatId);
    
    // Fetch messages for the specified chat
      const messages = await messageModel.find({ chatId })


    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},


accessChatByAgent: async (req , res) => {
  try {
    console.log("111");
    const agentId = req.params.agentId;
    console.log("222");


    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ error: 'Invalid Agent ID' });
    }
    console.log("333");


    // Find the chat where the agent is involved
    const chat = await RealTimeChatModel.findOne({ agentId: agentId, endedAt: { $exists: false } });
    console.log("chat: " , chat);
    const messages = chat.messages;
    console.log("555");
    if (!chat) {
      return res.status(404).json({ error: 'No chat found for the given Agent ID.' });
    }
    console.log("666");

    return res.status(200).json({ msg: "Chat found successfully" , chat });
  } catch (error) {
    // Return a 500 status code for server error and send the error message in the response body
    return res.status(500).json({ error: 'Error accessing chat by agent: ' + error.message });
  }
},


};

module.exports = realTimeChatController;