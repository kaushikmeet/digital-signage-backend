const mongoose = require("mongoose");

module.exports = mongoose.model(
  "PlaybackLog",
  new mongoose.Schema({
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true
    },
    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  })
);
