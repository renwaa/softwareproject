const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: false,
    // },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required : true,
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
      ref : "userModel",
      required: true,
    },
    subCategory: {
      type: String,
      enum : ['Desktops' ,'Laptops' ,'Printers' ,'Servers' ,'Networking equipment' , 
      'Operating system' , 'Application software' , 'Custom software' ,'Integration issues' ,
      'Email issues' , 'Internet connection problems' ,'Website errors'  ],
      required: true,
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "workflowModel",
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "agentModel",
    },
    solution : {
      type :String , 
    },
    name: {
      type : String,
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

// ticketSchema.virtual('timeOfR').get(function () {
//   if (this.endedAt) {
//     return this.endedAt - this.createdAt;
//   }
//   return null;
// });

module.exports = mongoose.model('ticketModel', ticketSchema);
module.exports.Schema = ticketSchema;
