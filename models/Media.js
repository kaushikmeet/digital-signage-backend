const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    title: String,

    type: {
      type: String,
      enum: ["image", "video", "text", "html"],
      required: true
    },

    url: String,
    content: String,

    // optional styling / metadata
    meta: {
      fontSize: Number,
      color: String,
      bgColor: String,
      refreshInterval: Number // for dynamic data
    },

    duration: {
      type: Number,
      default: 10
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
