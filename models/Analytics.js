const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
  {
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },
    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
    duration:{
      type: Number,
      default: 0
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
    zoneId:{
      type:String,
      default:"main"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", AnalyticsSchema);
