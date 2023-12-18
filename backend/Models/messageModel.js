const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'realTimeChatModel',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type : Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'userModel',
      required: true,
    },
  },
  
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('messageModel', messageSchema);
module.exports.Schema = messageSchema;
