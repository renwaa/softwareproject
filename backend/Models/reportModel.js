const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    // },
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
      ref:'agentModel',
    },
    // createdBy: {  //managerId
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref : 'userModel',
    //   required: true,
      // validate: {
      //   validator: async function (value) {
      //     const user = await mongoose.model('userModel').findById(value);
      //     return user && user.userRole === 'manager';
      //   },
      //   message: 'The createdBy field must be a manager.',
      // },
    // },
  },
  // schemaOptions
  {
    strict: false,
    timestamps: false,
  }
);

module.exports = mongoose.model('reportModel', reportSchema);
module.exports.Schema = reportSchema;
