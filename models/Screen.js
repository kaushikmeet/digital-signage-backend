const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    x: { type: Number, min: 0, max: 1, required: true },
    y: { type: Number, min: 0, max: 1, required: true },
    w: { type: Number, min: 0, max: 1, required: true },
    h: { type: Number, min: 0, max: 1, required: true },

    zIndex: {
      type: Number,
      default: 1
    },

    active: {
      type: Boolean,
      default: true
    },

    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      default: null
    },

    fallbackMediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null
    }
  },
  { _id: true }
);

const screenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: String,

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

    zones: {
      type: [zoneSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Screen", screenSchema);
