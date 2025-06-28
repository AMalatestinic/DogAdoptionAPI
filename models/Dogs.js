const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isAdopted: {
    type: Boolean,
    default: false,
  },
  thankYouMessage: { type: String, default: "" },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Dog", dogSchema);
