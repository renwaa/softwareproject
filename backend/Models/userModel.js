const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    firstName: {
      type: String,
      
    },
    secondName: {
      type: String,
      
    },
    email: {
      type: String,
      required: true,
      unique:true
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
