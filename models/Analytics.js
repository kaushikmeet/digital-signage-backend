const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
  {
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      index: true
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScreenGroup",
      index: true
    },

    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },

    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      index: true
    },

    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist"
    },

    type: {
      type: String,
      enum: ["media", "widget"],
      default: "media"
    },

    playedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    duration: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", AnalyticsSchema);
