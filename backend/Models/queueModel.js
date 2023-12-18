const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //   },
      low : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ticketModel",
        }
      ],
      medium : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ticketModel",
        }
      ],
      high : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ticketModel",
        }
      ],
      combined : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ticketModel",
        }
      ],
      
      
});

module.exports = mongoose.model('queueModel' , queueSchema);
module.exports.Schema = queueSchema;