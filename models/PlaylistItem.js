const mongoose = require("mongoose");

const PlaylistItemSchema = new mongoose.Schema(
  {
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
      index: true
    },

    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true
    },

    duration: {
      type: Number,
      required: true,
      min: 1
    },

    // 🔢 Order in playlist
    position: {
      type: Number,
      required: true,
      index: true
    },

    // 📅 Days of week
    days: {
      type: [String],
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },

    // ⏱ Minutes since midnight (0–1440)
    startTime: {
      type: Number,
      min: 0,
      max: 1440,
      default: null
    },

    endTime: {
      type: Number,
      min: 0,
      max: 1440,
      default: null,
      validate: {
        validator: function (v) {
          if (v == null || this.startTime == null) return true;
          return v > this.startTime;
        },
        message: "endTime must be greater than startTime"
      }
    }
  },
  {
    timestamps: true,
    collection: "playlistitems"
  }
);

module.exports = mongoose.model("PlaylistItem", PlaylistItemSchema);
