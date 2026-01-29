const ProofOfPlay = require("../models/ProofOfPlay");
const Screen = require("../models/Screen");
const Analytics = require("../models/Analytics");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");

exports.logPlay = async (req, res) => {
  try {
    const { screenId, mediaId, duration } = req.body;

    if (!screenId || !mediaId) {
      return res.status(400).json({
        error: "screenId and mediaId are required",
      });
    }

    // ✅ Save proof-of-play
    const pop = await ProofOfPlay.create({
      screenId,
      mediaId,
      duration: duration || 0,
      startedAt: new Date(),
      status: "played",
    });

    // ✅ Emit live analytics update
    const io = req.app.get("io");
    if (io) {
      io.emit("analytics-update", {
        screenId,
        mediaId,
        duration: duration || 0,
        playedAt: pop.startedAt,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Proof-of-play log error:", err);
    res.status(500).json({ error: "Failed to log play" });
  }
};

/* CREATE PLAY LOG */
exports.createAnalyticsEntry = async (req, res) => {
  try {
    const { screenId, mediaId, duration = 0, zoneId } = req.body;

    await Analytics.create({
      screenId,
      mediaId,
      duration,
      zoneId
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics log failed" });
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
          plays: { $sum: 1 },
        },
      },
      { $sort: { plays: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalPlays,
      totalScreens,
      topMedia,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===========================
   KPI METRICS
=========================== */
exports.getKpis = async (req, res) => {
  const result = await Analytics.aggregate([
    {
      $group: {
        _id: null,
        totalPlays: { $sum: 1 },
        totalDuration: { $sum: "$duration" },
        avgDuration: { $avg: "$duration" },
      },
    },
  ]);

  res.json(
    result[0] || {
      totalPlays: 0,
      totalDuration: 0,
      avgDuration: 0,
    },
  );
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
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
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
        duration: { $sum: "$duration" },
      },
    },
    { $sort: { plays: -1 } },
    { $limit: 10 },
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
            $dateToString: { format: "%Y-%m-%d", date: "$startedAt" },
          },
        },
        plays: { $sum: 1 },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  res.json(
    data.map((d) => ({
      day: d._id.day,
      plays: d.plays,
    })),
  );
};

exports.exportCsv = async (req, res) => {
  try {
    const logs = await ProofOfPlay.find()
      .populate("screenId", "name")
      .populate("mediaId", "filename")
      .lean();

    const parser = new Parser({
      fields: [
        { label: "Screen", value: "screenId.name" },
        { label: "Media", value: "mediaId.filename" },
        { label: "Duration", value: "duration" },
        { label: "Played At", value: "startedAt" },
      ],
    });

    const csv = parser.parse(logs);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=proof-of-play.csv",
    );
    res.send(csv);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "CSV export failed" });
  }
};

exports.revenueByMedia = async (req, res) => {
  const data = await ProofOfPlay.aggregate([
    { $match: { status: "played" } },
    {
      $lookup: {
        from: "media",
        localField: "mediaId",
        foreignField: "_id",
        as: "media",
      },
    },
    { $unwind: "$media" },
    {
      $group: {
        _id: "$mediaId",
        plays: { $sum: 1 },
        revenue: {
          $sum: "$media.pricePerPlay",
        },
      },
    },
  ]);

  res.json(data);
};

exports.bestTimeSlots = async (req, res) => {
  const data = await ProofOfPlay.aggregate([
    { $match: { status: "played" } },
    {
      $group: {
        _id: {
          hour: { $hour: "$startedAt" },
          day: { $dayOfWeek: "$startedAt" },
        },
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
    { $limit: 5 },
  ]);

  res.json(data);
};

// GET /analytics/screen/:screenId
exports.analyticsByScreen = async (req, res) => {
  const { screenId } = req.params;

  const data = await ProofOfPlay.aggregate([
    {
      $match: {
        screenId: new mongoose.Types.ObjectId(screenId),
        status: "played",
      },
    },
    {
      $group: {
        _id: "$screenId",
        totalPlays: { $sum: 1 },
        totalDuration: { $sum: "$duration" },
      },
    },
  ]);

  res.json(data[0] || { totalPlays: 0, totalDuration: 0 });
};

exports.bestHours = async (req, res) => {
  const data = await ProofOfPlay.aggregate([
    { $match: { status: "played" } },
    {
      $group: {
        _id: { hour: { $hour: "$startedAt" } },
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
  ]);

  res.json(data);
};

exports.analyticsByZone = async (req, res) => {
  const data = await ProofOfPlay.aggregate([
    { $match: { zoneId: new mongoose.Types.ObjectId(req.params.zoneId) } },
    {
      $group: {
        _id: "$zoneId",
        plays: { $sum: 1 },
        duration: { $sum: "$duration" }
      }
    }
  ]);

  res.json(data[0] || { plays: 0, duration: 0 });
};
