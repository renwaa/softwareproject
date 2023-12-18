const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
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

FAQSchema.index({ question: 'text' }); // Corrected the method to create a text index

module.exports = mongoose.model('FAQModel', FAQSchema); // Corrected the model export
