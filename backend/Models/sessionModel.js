const mongoose = require("mongoose");
<<<<<<< HEAD
const userModel = require("./userModel");
=======

>>>>>>> origin/lisa
const schemaOptions = {
  strict: true,
  timestamps: true,
};
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
      ref: "userModel",
=======
      ref: "userModel" || "agentModel",
>>>>>>> origin/lisa
      requied: true,
    },
    token: {
      type: String,
      requied: true,
    },
    expiresAt: {
      type: Date,
      requied: true,
    },
  },
 schemaOptions
);

<<<<<<< HEAD
module.exports = mongoose.model("sessionSchema", sessionSchema);
=======
module.exports = mongoose.model("sessionSchema", sessionSchema);
>>>>>>> origin/lisa
