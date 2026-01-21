const mongoose = require("mongoose");

module.exports = mongoose.model("Playlist", {
  name: String
});
