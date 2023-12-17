const mongoose = require('mongoose');


const agentSchema = new mongoose.Schema({
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
      email: {
        type: String,
        required: true,
        unique:true
      },
      username: {
        type: String,
        required: true,
      },
      role : {
        type: String,
        enum : ['agent'],
        required: true,
      },
      agentType: {
        type: String,
        enum: ['agent1', 'agent2', 'agent3'],
        required: true
      },

      status :{
        type : Number,
        required: true
      },
      rating:[ { 
        type: Number,
      }
     ],
      tickets: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ticketModel",
        }
      ]
    

});

module.exports = mongoose.model('agentModel' , agentSchema);
module.exports.Schema = agentSchema;