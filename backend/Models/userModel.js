const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
<<<<<<< HEAD
    email: {
      type: String,
      required: true,
      unique:true
    },
=======
>>>>>>> origin/lisa
    password: {
      type: String,
      required: true,
      minlength:5
    },
<<<<<<< HEAD
    // ticketId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'ticketModel',
    // },
=======
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticketModel",
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
>>>>>>> origin/lisa
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
<<<<<<< HEAD
      enum : ['user' , 'admin' , 'agent' , 'manager'],
      required: true,
    },
    // rating: {
    //   type: Number,
    // },
=======
      enum : ['user' , 'admin' ,'manager'],
      required: true,
    },
    notify: {
      type: Boolean,
     
    },
    mfaEnabled : {
      type : Boolean,
      
    },
    mfaSecret : {
      type : String,

    },

    mfaCode:{
      type: String,
    }

>>>>>>> origin/lisa
  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('userModel', userSchema);
module.exports.Schema = userSchema;
