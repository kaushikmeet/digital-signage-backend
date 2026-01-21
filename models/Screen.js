const mongoose = require("mongoose");

module.exports = mongoose.model("Screen", {
  name: String,
  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist"
  }
});
