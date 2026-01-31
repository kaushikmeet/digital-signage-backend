const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  name: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  zIndex: Number,

  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    default: null
  },

  fallbackMediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null
  },
  
  locked: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const ScreenGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      type: [ZoneSchema],
      default: []
    },

    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      default: null
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("ScreenGroup", ScreenGroupSchema);
