const ProofOfPlay = require("../models/ProofOfPlay");
const Screen = require("../models/Screen");
const mongoose = require("mongoose");

exports.logPlay = async (req, res) => {
  try {
    const { screenId, mediaId, duration } = req.body;

    if (!screenId || !mediaId) {
      return res.status(400).json({
        error: "screenId and mediaId are required"
      });
    }

    await ProofOfPlay.create({
      screenId,
      mediaId,
      duration: duration || 0,
      startedAt: new Date(),
      status: "played"
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Proof-of-play log error:", err);
    res.status(500).json({ error: "Failed to log play" });
  }
};

/* ===========================
   DASHBOARD SUMMARY
=========================== */
exports.getSummary = async (req, res) => {
  try {
    const totalPlays = await ProofOfPlay.countDocuments({ status: "played" });
    const totalScreens = await Screen.countDocuments();

    const topMedia = await ProofOfPlay.aggregate([
      { $match: { status: "played" } },
      {
        $group: {
          _id: "$mediaId",
          plays: { $sum: 1 }
        }
      },
      { $sort: { plays: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalPlays,
      totalScreens,
      topMedia
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===========================
   KPI METRICS
=========================== */
exports.getKpis = async (req, res) => {
  const { screenId, from, to } = req.query;

  const match = { status: "played" };

  if (screenId) {
    match.screenId = new mongoose.Types.ObjectId(screenId);
  }

  if (from || to) {
    match.startedAt = {};
    if (from) match.startedAt.$gte = new Date(from);
    if (to) match.startedAt.$lte = new Date(to);
  }

  const [result] = await ProofOfPlay.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalPlays: { $sum: 1 },
        totalDuration: { $sum: "$duration" }
      }
    }
  ]);

  res.json({
    totalPlays: result?.totalPlays || 0,
    totalDuration: result?.totalDuration || 0
  });
};

/* ===========================
   PLAYS BY SCREEN
=========================== */
exports.playsByScreen = async (req, res) => {
  const data = await ProofOfPlay.aggregate([
    { $match: { status: "played" } },
    {
      $group: {
        _id: "$screenId",
        plays: { $sum: 1 }
      }
    },
    { $sort: { plays: -1 } }
  ]);

  res.json(data);
};

/* ===========================
   PLAYS BY MEDIA
=========================== */
exports.playsByMedia = async (req, res) => {
  const data = await ProofOfPlay.aggregate([
    { $match: { status: "played" } },
    {
      $group: {
        _id: "$mediaId",
        plays: { $sum: 1 },
        duration: { $sum: "$duration" }
      }
    },
    { $sort: { plays: -1 } },
    { $limit: 10 }
  ]);

  res.json(data);
};

/* ===========================
   DAILY TREND
=========================== */
exports.dailyTrend = async (req, res) => {
  const data = await ProofOfPlay.aggregate([
    { $match: { status: "played" } },
    {
      $group: {
        _id: {
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$startedAt"
            }
          }
        },
        plays: { $sum: 1 }
      }
    },
    { $sort: { "_id.day": 1 } }
  ]);

  res.json(data);
};
