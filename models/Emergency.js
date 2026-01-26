// models/Emergency.js
const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema({
  mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
  screenId: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
  active: { type: Boolean, default: false },
  expiresAt: Date
});

module.exports = mongoose.model("Emergency", EmergencySchema);
