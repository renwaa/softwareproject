const mongoose = require('mongoose');

// Define the customization schema
const customizationSchema = new mongoose.Schema({
  backgroundColor: {
    type: String,
    required: false,
    validate: {
        validator: function (value) {
          // Regular expression to validate hexadecimal color code
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        },
        message: props => `${props.value} is not a valid hexadecimal color code!`,
      },
  },
  fontColor: {
    type: String,
    required: false,
    validate: {
        validator: function (value) {
          // Regular expression to validate hexadecimal color code
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        },
        message: props => `${props.value} is not a valid hexadecimal color code!`,
      },
  },
  fontSize: {
    type: Number, // You can change the type based on your requirements (e.g., Number for pixel size)
    required: false,
  },
  logoUrl: {
    type: String,
    required: false,
  },
},
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

// Create the customization model
module.exports = mongoose.model('customizationmodels', customizationSchema);
module.exports.Schema = customizationSchema;