const mongoose = require('mongoose');


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
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "userModel" || "agentModel",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "userModel" || "agentModel",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messageModel",
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
