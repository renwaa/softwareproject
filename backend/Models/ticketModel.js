const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    name:{
      type: String,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: false,
    },
    type: {
      type: String,
      enum : ['Software' , 'Hardware' , 'Networks'],
      required: false,
    },
    agent: {
      type: String,
      enum: ['agent1' , 'agent2' , 'agent3'],
      required: false, 
      ref:'agentModel',
    },
    createdAt: {
      type: Date,
      required: false,
    },
    endedAt: {
      type: Date,
    },
    modifiedAt: {
      type: Date,
    },
    timeofRes: {
      type: Date,
    },
    solution: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'userModel',
      required: false,
    },
    subCategory: {
      type: String,
      enum : ['Desktops' ,'Laptops' ,'Printers' ,'Servers' ,'Networking equipment' , 
      'Operating system' , 'Application software' , 'Custom software' ,'Integration issues' ,
      ' Email issues' , ' Internet connection problems' ,'Website errors'  ],
      required: false,
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workflowModel',
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'agentModel',
      required: false,
    },
    rating:{
      type: Number,
      ref: 'agentModel',
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
