const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: "playlists"
  }
);

module.exports = mongoose.model("Playlist", playlistSchema);
