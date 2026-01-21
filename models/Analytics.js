const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  screenId: mongoose.Schema.Types.ObjectId,
  mediaId: mongoose.Schema.Types.ObjectId,
  playedAt: { type: Date, default: Date.now },
  duration: Number
});

module.exports = mongoose.model("Analytics", analyticsSchema);
