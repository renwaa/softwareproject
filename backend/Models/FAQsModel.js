const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('FAQModel', FAQSchema);
module.exports.Schema = FAQSchema;