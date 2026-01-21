const mongoose = require("mongoose");

const ScreenPlaylistSchema = new mongoose.Schema(
  {
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
      unique: true
    },
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScreenPlaylist", ScreenPlaylistSchema);
