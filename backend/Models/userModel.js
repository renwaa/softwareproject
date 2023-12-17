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
    password: {
      type: String,
      required: true,
      minlength:5
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticketModel",
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
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

  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('userModel', userSchema);
module.exports.Schema = userSchema;
