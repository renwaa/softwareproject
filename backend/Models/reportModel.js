const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type : String,
      required : true , 
    },

    resolutionTime: {
      type: Date,
      required : true,
    },
    agentRating: {
      type: Number,
      required : true,
    },

    openTicket:{
      type : Number ,
      required : true,
    },
    closeTicket:{
      type : Number ,
      required : true,
    },
    pendingTicket:{
      type : Number ,
      required : true,
    },
   

  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('reportModel', reportSchema);
module.exports.Schema = reportSchema;