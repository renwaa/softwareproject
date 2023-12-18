const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
<<<<<<< HEAD
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
      required : true,
    },
=======
    content: {
      type : String,
      required : true , 
    },

>>>>>>> origin/lisa
    resolutionTime: {
      type: Date,
      required : true,
    },
    agentRating: {
<<<<<<< HEAD
      type: Int32,
      required : true,
    },
    createdBy: {  //managerId
      type: mongoose.Schema.Types.ObjectId,
      ref : 'userModel',
      required: true,
      // validate: {
      //   validator: async function (value) {
      //     const user = await mongoose.model('userModel').findById(value);
      //     return user && user.userRole === 'manager';
      //   },
      //   message: 'The createdBy field must be a manager.',
      // },
    },
=======
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
   

>>>>>>> origin/lisa
  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('reportModel', reportSchema);
module.exports.Schema = reportSchema;
