const RealTimeChatModel = require('../Models/realTimeChatModel');
const MessageModel = require('../Models/messageModel');
const UserModel = require('../Models/userModel');
const mongoose = require('mongoose');

const chatController = {
        createChat: async (userId, agentId) => {
          try {
            if (!userId || !agentId) {
              throw new Error('User ID and Agent ID are required to create a chat.');
            }
      
          const agent = await UserModel.findOne({ _id: agentId });   
      
            // Check if a chat already exists with the same userId and agentId
            const existingChat = await RealTimeChatModel.findOne({ userId, agentId });
            if (existingChat) {
              throw new Error('Chat already exists for the given User ID and Agent ID.');
            }
      
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
      
            console.log("chat id:" , newChat._id);
        
            await newChat.save();
            console.log("Chat initialized successfully");
        
            return { chatId: newChat._id, msg: "Chat created successfully" };
          } catch (error) {
            // Handle errors
            console.error(error);
            throw new Error("Error creating chat");
          }
        },
   
};

module.exports = chatController;