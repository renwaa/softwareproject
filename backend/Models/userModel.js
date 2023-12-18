const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
     },
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ticketModel',
      required: false,
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
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum : ['user' , 'admin' , 'agent' , 'manager'],
      required: true,
    },
    rating: {
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 0, //0 is available and 1 is not
      required:false,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
      required: false,
    },
   
  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
    collection: 'user',
  }
);

module.exports = mongoose.model('userModel', userSchema);
module.exports.Schema = userSchema;
