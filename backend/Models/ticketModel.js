const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true,
    },
    type: {
      type: String,
      enum : ['Software' , 'Hardware' , 'Networks'],
      required: true,
    },
    agent: {
      type: String,
      enum: ['agent1' , 'agent2' , 'agent3'],
      required: false,
    },
    issueDescription: {
      type: String,
      required: true,
    },  
    createdAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    modifiedAt: {
      type: Date,
    },
    timeOfRes: {
      type: Date,
    },
    solution: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'userModel',
      required: true,
    },
    subCategory: {
      type: String,
      enum : ['Desktops' ,'Laptops' ,'Printers' ,'Servers' ,'Networking equipment' , 
      'Operating system' , 'Application software' , 'Custom software' ,'Integration issues' ,
      ' Email issues' , ' Internet connection problems' ,'Website errors'  ],
      required: true,
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workflowModel',
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'userModel',
      required: false,
    },
  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

// ticketSchema.virtual('resolutionTime').get(function () {
//   if (this.endedAt) {
//     return this.endedAt - this.createdAt;
//   }
//   return null;
// });

module.exports = mongoose.model('ticketModel', ticketSchema);
module.exports.Schema = ticketSchema;
