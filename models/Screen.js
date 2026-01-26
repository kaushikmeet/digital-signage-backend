const mongoose = require("mongoose");

module.exports = mongoose.model("Screen", {
  name: { type: String, required: true },
  location: String,

  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    default: null,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScreenGroup"
  },
   status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline"
  },
  ipAddress: String,
  lastActiveAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fallbackMediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null,
  },
  zones: [
    {
      zoneId: String,
      playlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
      position: {
        x: Number,
        y: Number,
        width: Number,
        height: Number,
      },
    }
  ],
});
