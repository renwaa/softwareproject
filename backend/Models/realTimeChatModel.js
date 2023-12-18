const mongoose = require('mongoose');

<<<<<<< HEAD
=======

>>>>>>> origin/lisa
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
<<<<<<< HEAD
      ref : 'userModel',
=======
      ref : "userModel",
>>>>>>> origin/lisa
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
      ref : 'userModel',
=======
      ref : "agentModel",
>>>>>>> origin/lisa
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
        ref: 'messageModel',
=======
        ref: "messageModel",
>>>>>>> origin/lisa
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
