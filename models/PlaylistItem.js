const mongoose = require("mongoose");

const PlaylistItemSchema = new mongoose.Schema(
  {
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      required: true
    },

    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true
    },

    duration: {
      type: Number,
      required: true
    },

    position: {
      type: Number,
      default: 1
    },

    // 📅 Days of week
    days: {
      type: [String],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },

    // ⏱ Time in minutes (09:30 → 570)
    startTime: {
      type: Number,
      default: null
    },

    endTime: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlaylistItem", PlaylistItemSchema);
