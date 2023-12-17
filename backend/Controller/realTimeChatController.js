const RealTimeChatModel = require('../models/realTimeChatModel');
const MessageModel = require('../Models/messageModel');
const UserModel = require('../Models/userModel');
const { getCurrentUser } = require("./authController");

 
const mongoose = require('mongoose');

const realTimeChatController = {
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
  

  sendMessage: async (req, res) => {
    try {
      const chatId = req.params;
      const content  = req.body;
      const createdBy = await getCurrentUser(req);

      const newMessage = new MessageModel({
        _id: new mongoose.Types.ObjectId(),
        chatId,
        content,
        createdAt: new Date(),
        createdBy,
      });

      await newMessage.save();

      // Update the chat with the new message
      await RealTimeChatModel.findByIdAndUpdate(chatId, {
        $push: { messages: newMessage._id },
      });

      return res.status(200).json({ msg: "Message sent successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  endChat: async (req, res) => {
    try {
      const { chatId } = req.params;

      const chat = await RealTimeChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
      }

      chat.endedAt = new Date();
      await chat.save();

      return res.status(200).json({ msg: "Chat ended successfully" });
    } catch (error) {
      return res.status(500).json({ message: 'Error ending chat: ' + error.message });
    }
  },
//   getChatHistory: async (chatId) => {
//     try {
//       const chat = await RealTimeChat.findById(chatId).populate('messages');
//       if (!chat) {
//         throw new Error('Chat not found');
//       }

//       return chat.messages; // Return the array of messages in the chat
//     } catch (error) {
//       throw new Error('Error getting chat history: ' + error.message);
//     }
//   },
};

module.exports = realTimeChatController;