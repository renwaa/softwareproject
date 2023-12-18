const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    // Reference to the report or ticket (you can adjust based on your needs)
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reportModel',
    },
    chartType: {
      type: String,
    },
    // Example fields for analytics data
    ticketStatusAnalytics: {
      open: Number,
      pending: Number,
      closed: Number,
    },
    ticketPriorityAnalytics: {
      high: Number,
      medium: Number,
      low: Number,
    },
    ticketTypeAnalytics: {
      software: Number,
      hardware: Number,
      networks: Number,
    },
    // Include other analytics fields based on your requirements
  },
  {
    strict: false,
    timestamps: false,
  }
);

module.exports = mongoose.model('analyticsModel', analyticsSchema);
module.exports.Schema = analyticsSchema;
