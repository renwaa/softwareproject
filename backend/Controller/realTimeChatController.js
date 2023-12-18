const RealTimeChatModel = require('../Models/realTimeChatModel');
const MessageModel = require('../Models/messageModel');
const userModel = require('../Models/userModel');
const agentModel = require('../Models/agentModel');
const userController = require('../Controller/userController');
const authController = require('../Controller/authController');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = "xy27889pq"; // Keep the original secret key
const express = require('express');
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const realTimeChatController = {
  handleSocketConnection: (socket) => {
    // Handle the socket connection and authentication
    socket.on('join-chat', async (chatId) => {
      try {
        // Authenticate the user and get the user ID (you need to implement this part)
        const user = await userController.getCurrentUser(socket.request, socket.request.res);
        const userId = user._id;

        // Associate the user ID with the socket connection
        socket.userId = userId;

        // Join the chat room
        socket.join(chatId);

        // Emit a welcome message or perform other actions as needed
        io.to(chatId).emit('message', { userId, content: 'User joined the chat.' });
      } catch (error) {
        console.error('Error authenticating user:', error);
      }
    });
  },
  createChat: async (userId, agentId, issueType) => {
    try {
      if (!userId || !agentId || !issueType) {
        throw new Error('User ID, Agent ID, and Issue Type are required to create a chat.');
      }

      // Check if a chat already exists with the same userId and agentId
      const existingChat = await RealTimeChatModel.findOne({ userId, agentId });
      if (existingChat) {
        throw new Error('Chat already exists for the given User ID and Agent ID.');
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
      console.log("Chat initialized successfully");

      return { chatId: newChat._id, msg: "Chat created successfully" };
    } catch (error) {
      // Handle errors
      console.error(error);
      throw new Error("Error creating chat");
    }
  },

  // findAvailableAgent: async (issueType) => {
  //   try {
  //     // Find an available agent with the user's agentType and status
  //     const availableAgent = await agentModel.findOne({
  //       role: 'agent',
  //       agentType: issueType,
  //       status: 0, // Assuming status 1 means the agent is available, adjust as needed
  //     });

  //     return availableAgent;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Error finding available agent by issue type');
  //   }
  // },
  findAvailableAgent: async (issueType) => {
    try {
      // Find an available agent with the user's agentType and status
      const availableAgent = await agentModel.findOne({
        role: 'agent',
        agentType: mapIssueToAgentType(issueType),
        status: 0, 
      });
  
      return availableAgent;
    } catch (error) {
      console.error(error);
      throw new Error('Error finding available agent by user issue type');
    }
  },
  // sendMessage: async (req, res) => {
  //   try {
  //     // Assuming chatId is in the URL parameters
  //     const chatId = req.params.chatId;
  
  //     // Assuming content is in the dedicated field of the request body
  //     const { messageContent } = req.body;
  
  //     const createdBy = req.user.userId; // Assuming user is authenticated
  
  //     const newMessage = new MessageModel({
  //       _id: new mongoose.Types.ObjectId(),
  //       chatId,
  //       content: messageContent, // Use the dedicated field for content
  //       createdAt: new Date(),
  //       createdBy,
  //     });
  
  //     await newMessage.save();
  
  //     // Emit the new message to the specific chat room
  //     io.to(chatId).emit('message', newMessage);
  
  //     // Update the chat with the new message
  //     await RealTimeChatModel.findByIdAndUpdate(chatId, {
  //       $push: { messages: newMessage._id },
  //     });
  
  //     return res.status(200).json({ msg: "Message sent successfully" });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },

  requestRealTimeChat: async (req, res) => {
    try {
      // Get the current user including the issueType
      const user = await authController.getCurrentUser(req, res);

      // Ensure that user has the required properties
      if (!user || !user.issueType) {
        return res.status(400).json({ success: false, message: 'User or issueType not found' });
      }

      const userId = user._id;
      const issueType = user.issueType; // Get issueType from the userModel

      // Check for an available agent with the specific issueType
      const agent = await realTimeChatController.findAvailableAgent(issueType);

      if (agent) {
        const agentId = agent._id;

        // Perform the logic for creating a real-time chat
        const { chatId, msg } = await realTimeChatController.createChat(userId, agentId, issueType);

        // Send a response back to the client
        return res.status(201).json({ success: true, message: 'Real-time chat initiated successfully', agentId });
      } else {
        return res.status(500).json({ success: false, message: 'No available agents for the specified issue type' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  endChat: async (chatId) => {
    try {
      // Find the chat by ID
      const chat = await RealTimeChatModel.findById(chatId);
  
      // Check if the chat exists
      if (!chat) {
        throw new Error('Chat not found.');
      }
  
      // Update the chat's end time or perform any other necessary actions
      chat.endedAt = new Date();
      await chat.save();
  
      console.log('Chat ended successfully');
  
      return { success: true, message: 'Chat ended successfully' };
    } catch (error) {
      // Handle errors
      console.error(error);
      throw new Error('Error ending chat');
    }
  }
};
const mapIssueToAgentType = (issueType) => {
  switch (issueType) {
    case 'software':
      return 'agent1';
    case 'hardware':
      return 'agent2';
    case 'network':
      return 'agent3';
    default:
      throw new Error('Invalid issueType');
  }
};

module.exports = realTimeChatController;