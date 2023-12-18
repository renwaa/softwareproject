const mongoose = require('mongoose');
const userModel = require("./userModel");
const agentModel = require("./agentModel");

const realTimeChatSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : userModel,
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : agentModel,
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: messageModel,
      }
    ]
  },
  
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('realTimeChatModel', realTimeChatSchema);
module.exports.Schema = realTimeChatSchema;