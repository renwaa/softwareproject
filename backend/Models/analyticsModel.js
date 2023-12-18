const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'reportModel',
      required: true,
    },
    chartType: {
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

module.exports = mongoose.model('analyticsModel', analyticsSchema);
module.exports.Schema = analyticsSchema;
