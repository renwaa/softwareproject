const messageModel = require('../Models/messageModel');

const messageController = {
  saveMessage: async (chatId, content, createdBy) => {
    try {
      const message = new messageModel({
        chatId,
        content,
        createdAt: new Date(),
        createdBy,
      });

      await message.save();

      return message;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = messageController;