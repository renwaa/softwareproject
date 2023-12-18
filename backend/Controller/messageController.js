const messageModel = require('../Models/messageModel');
const realTimeChatModel = require('../Models/realTimeChatModel');


const messageController = {
  // saveMessage: async (chatId, content, createdBy) => {
  //   try {
  //     const message = new messageModel({
  //       chatId,
  //       content,
  //       createdAt: new Date(),
  //       createdBy,
  //     });

  //     await message.save();

  //     return message;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // sendMessage: async (req, res) => {
  //   try {
  //     const { chatId, content } = req.body;
  //     const createdBy = req.user.userId; // Assuming user is authenticated

  //     const newMessage = new MessageModel({
  //       _id: new mongoose.Types.ObjectId(),
  //       chatId,
  //       content,
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
  sendMessage: async (req, res) =>{
    try {
      const { chatId, senderId, receiverId, content } = req.body;
  
      // Create a new message
      const newMessage = new messageModel({
        _id: new mongoose.Types.ObjectId(),
        chatId: chatId,
        content: content,
        createdAt: new Date(),
        sender: senderId,
        receiver: receiverId,
      });
  
      // Update the chat with the new message
      const updatedChat = await realTimeChatModel.findByIdAndUpdate(
        chatId,
        {
          $push: { messages: newMessage._id },
        },
        { new: true }
      );
  
      // Save the new message
      await newMessage.save();
  
      res.status(200).json({ success: true, message: newMessage, chat: updatedChat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getChatMessages: async (req, res) => {
    try {
      const { chatId } = req.params;

      // Retrieve the chat with populated messages
      const chat = await RealTimeChatModel.findById(chatId).populate('messages');

      res.status(200).json({ success: true, messages: chat.messages });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  saveMessage: async (chatId, senderId, receiverId, content) => {
    try {
      // Create a new message
      const newMessage = new MessageModel({
        _id: new mongoose.Types.ObjectId(),
        chatId: chatId,
        content: content,
        createdAt: new Date(),
        sender: senderId,
        receiver: receiverId,
      });

      // Update the chat with the new message
      const updatedChat = await RealTimeChatModel.findByIdAndUpdate(
        chatId,
        {
          $push: { messages: newMessage._id },
        },
        { new: true }
      );

      // Save the new message
      await newMessage.save();

      return { success: true, message: newMessage, chat: updatedChat };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
};

module.exports = messageController;