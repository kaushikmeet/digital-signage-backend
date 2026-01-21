const mongoose = require("mongoose");

module.exports = mongoose.model("Media", {
  filename: String,
  type: String,
  url: String
});
