// controllers/screens.controller.js
const Screen = require("../models/Screen");
const Media = require("../models/Media");

exports.getScreens = async (req, res) => {
  const screens = await Screen.aggregate([
  {
    $lookup: {
      from: "playlists",
      localField: "playlistId",
      foreignField: "_id",
      as: "playlist",
    },
  },
  { $unwind: { path: "$playlist", preserveNullAndEmptyArrays: true } },

  {
    $lookup: {
      from: "playlistitems",
      localField: "playlist._id",
      foreignField: "playlistId",
      as: "playlistItems",
    },
  },

  {
    $lookup: {
      from: "media",
      localField: "playlistItems.mediaId",
      foreignField: "_id",
      as: "media",
    },
  },

  {
    $addFields: {
      "playlist.items": {
        $map: {
          input: "$playlistItems",
          as: "item",
          in: {
            _id: "$$item._id",
            duration: "$$item.duration",
            position: "$$item.position",
            mediaId: {
              $first: {
                $filter: {
                  input: "$media",
                  as: "m",
                  cond: { $eq: ["$$m._id", "$$item.mediaId"] },
                },
              },
            },
          },
        },
      },
    },
  },

  { $project: { media: 0, playlistItems: 0 } },
]);
  res.json(screens);
};

exports.createScreen = async (req, res) => {
  try {
    const screen = await Screen.create(req.body);
    res.status(201).json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignScreenToPlaylist = async (req, res) => {
   const { screenId, playlistId } = req.body;

  if (!screenId || !playlistId) {
    return res.status(400).json({
      error: "Missing screenId or playlistId",
      screenId,
      playlistId,
    });
  }

  const screen = await Screen.findByIdAndUpdate(
    screenId,
    { playlistId },
    { new: true }
  );

  res.json(screen);
};


exports.deleteScreen = async (req, res) => {
  try {
    await Screen.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET SCREEN BY ID */
exports.getScreenById = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return res.status(404).json({ error: "Screen not found" });
    }

    res.json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkDeleteScreens = async (req, res) => {
  try {
    const { screenIds } = req.body;
    await Screen.deleteMany({ _id: { $in: screenIds } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.fallbackMediaUpdate = async (req, res) => {
 const screen = await Screen.findById(req.params.id).populate("fallbackMediaId");
  res.json(screen?.fallbackMediaId || null);
};

exports.zoneWiseUpdate = async (req, res) => {
  const { zones } = req.body;

  const screen = await Screen.findById(req.params.id);
  if (!screen) return res.status(404).json({ message: "Screen not found" });

  screen.zones = [];            // reset
  screen.zones.push(...zones); // re-add clean objects

  await screen.save();

  res.json(screen.zones);
};

exports.getZones = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid screen id" });
    }

    const screen = await Screen.findById(id).lean();

    if (!screen) {
      return res.status(404).json({ error: "Screen not found" });
    }

    res.json(screen.zones || []);
  } catch (err) {
    console.error("Get zones error:", err);
    res.status(500).json({ error: "Failed to load zones" });
  }
};

exports.updateZones = async (req, res) => {
  try {
    const { id } = req.params;
    let { zones } = req.body;

    zones = await sanitizeZones(zones);

    await Screen.findByIdAndUpdate(id, { zones });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zone update failed" });
  }
};


async function sanitizeZones(zones) {
  const mediaIds = zones
    .map(z => z.fallbackMediaId)
    .filter(Boolean);

  const existingMedia = await Media.find({
    _id: { $in: mediaIds }
  }).select("_id");

  const validIds = new Set(
    existingMedia.map(m => m._id.toString())
  );

  return zones.map(z => ({
    ...z,
    fallbackMediaId:
      z.fallbackMediaId && validIds.has(z.fallbackMediaId.toString())
        ? z.fallbackMediaId
        : null
  }));
}