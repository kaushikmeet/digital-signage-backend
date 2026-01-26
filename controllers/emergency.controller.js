const Emergency = require("../models/Emergency");

// POST /emergency/activate
exports.activateEmergency = async (req, res) => {
  const { mediaId, durationMinutes } = req.body;

  const expiresAt = new Date(
    Date.now() + durationMinutes * 60 * 1000
  );

  const emergency = await Emergency.findOneAndUpdate(
    {},
    { mediaId, active: true, expiresAt },
    { upsert: true, new: true }
  );

  // 🔴 PUSH TO ALL SCREENS
  req.io.emit("emergency-on", emergency);

  res.json({ success: true });
};

// POST /emergency/clear
exports.clearEmergency = async (req, res) => {
  await Emergency.updateOne({}, { active: false });

  req.io.emit("emergency-off");

  res.json({ success: true });
};

exports.triggerEmergency = async (req, res) => {
  const expiresAt = new Date(Date.now() + req.body.duration * 1000);

  await Emergency.findOneAndUpdate(
    { screenId: req.body.screenId },
    { mediaId: req.body.mediaId, expiresAt },
    { upsert: true }
  );

  io.to(req.body.screenId).emit("emergency");

  res.json({ success: true });
};
