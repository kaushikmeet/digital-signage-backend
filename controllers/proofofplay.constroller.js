const proof = require("../models/ProofOfPlay");


exports.getProofOfPlayLogs = async (req, res) => {
  try {
    const logs = await proof.find()
      .populate("mediaId", "name type")
      .populate("screenId", "name")
      .sort({ startedAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

