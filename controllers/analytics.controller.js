const analytics = require("../models/Analytics");

exports.getSummary = async (req, res) => {
  const totalPlays = await analytics.countDocuments();
  const topMedia = await analytics.aggregate([
    {
      $group: {
        _id: "$mediaId",
        plays: { $sum: 1 }
      }
    },
    { $sort: { plays: -1 } },
    { $limit: 5 }
  ]);

  res.json({ totalPlays, topMedia });
};