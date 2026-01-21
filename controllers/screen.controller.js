// controllers/screens.controller.js
const Screen = require("../models/Screen");

exports.getScreens = async (req, res) => {
  try {
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
            as: "playlist.items",
          },
        },
    
        {
          $lookup: {
            from: "media",
            localField: "playlist.items.mediaId",
            foreignField: "_id",
            as: "media",
          },
        },
    
        {
          $addFields: {
            "playlist.items": {
              $map: {
                input: "$playlist.items",
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
    
        {
          $project: {
            media: 0,
          },
        },
      ]);

    res.json(screens);
  } catch (err) {
    console.error("GET SCREENS ERROR:", err);
    res.status(500).json({ error: "Failed to load screens" });
  }
};

exports.createScreen = async (req, res) => {
  try {
    const screen = await Screen.create(req.body);
    res.status(201).json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteScreen = async (req, res) => {
  try {
    await Screen.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};