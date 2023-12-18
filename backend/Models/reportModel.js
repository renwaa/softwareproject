const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
     // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    // },
    content: {
      type : String,
      required : true , 
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'ticketModel',
    },
    agentId:{  //if rating agent
      type: mongoose.Schema.Types.ObjectId,
      ref : 'userModel',
    },
    ticketStatus: {
      type: String,
    },

    resolutionTime: {
      type: Date,
    },
    agentRating: {
      type: Number,
      required : false,
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
    strict: false,
    timestamps: false,
  }
);

module.exports = mongoose.model('reportModel', reportSchema);
module.exports.Schema = reportSchema;
