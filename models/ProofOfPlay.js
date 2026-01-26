const mongoose = require("mongoose");

const proofOfPlaySchema = new mongoose.Schema(
  {
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true
    },
    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["played", "skipped"],
      default: "played"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ProofOfPlay", proofOfPlaySchema);
