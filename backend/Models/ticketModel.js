const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true,
=======
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: false,
    // },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required : true,
>>>>>>> origin/lisa
    },
    type: {
      type: String,
      enum : ['Software' , 'Hardware' , 'Networks'],
      required: true,
    },
<<<<<<< HEAD
    agent: {
      type: String,
      enum: ['agent1' , 'agent2' , 'agent3'],
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
    },
    modifiedAt: {
      type: Date,
    },
    timeofR: {
      type: Date,
    },
    solution: {
      type: String,
      required: true,
    },
=======
    endedAt: {
      type: Date,
    },
    resolutionTime: {
      type: Date,
    },
>>>>>>> origin/lisa
    status: {
      type: String,
      required: true,
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
    subCategory: {
      type: String,
      enum : ['Desktops' ,'Laptops' ,'Printers' ,'Servers' ,'Networking equipment' , 
      'Operating system' , 'Application software' , 'Custom software' ,'Integration issues' ,
<<<<<<< HEAD
      ' Email issues' , ' Internet connection problems' ,'Website errors'  ],
=======
      'Email issues' , 'Internet connection problems' ,'Website errors'  ],
>>>>>>> origin/lisa
      required: true,
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
      ref: 'workflowModel',
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'userModel',
      required: true,
    },
=======
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
    }
>>>>>>> origin/lisa
  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

<<<<<<< HEAD
ticketSchema.virtual('resolutionTime').get(function () {
  if (this.endedAt) {
    return this.endedAt - this.createdAt;
  }
  return null;
});
=======
// ticketSchema.virtual('timeOfR').get(function () {
//   if (this.endedAt) {
//     return this.endedAt - this.createdAt;
//   }
//   return null;
// });
>>>>>>> origin/lisa

module.exports = mongoose.model('ticketModel', ticketSchema);
module.exports.Schema = ticketSchema;
