const mongoose = require("mongoose");

module.exports = mongoose.model("PlaylistItem", {
  playlistId: mongoose.Schema.Types.ObjectId,
  mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
  duration: Number,
  position: Number
});
