const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
   
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
      ref: 'ticketModel'
    },
    username: {
      type: String,
      
    },
    role: {
      type: String,
      enum : ['user' , 'admin' , 'agent' , 'manager'],
     
    },

  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('userModel', userSchema);
module.exports.Schema = userSchema;
