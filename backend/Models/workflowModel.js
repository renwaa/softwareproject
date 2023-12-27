const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum : ['Software' , 'Hardware' , 'Networks'],
      required: true,
    },
    subCategory: {
      type: String,
      enum : ['Desktops' ,'Laptops' ,'Printers' ,'Servers' ,'NetworkingEquipment' , 
      'OperatingSystem' , 'ApplicationSoftware' , 'CustomSoftware' ,'IntegrationIssues' ,
      ' EmailIssues' , ' InternetConnectionProblems' ,'WebsiteErrors'  ],
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    customWorkflow: {
      type:String,
      required: true,
    },
  },
  // schemaOptions
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model('workflowModel', workflowSchema);
module.exports.Schema = workflowSchema;
