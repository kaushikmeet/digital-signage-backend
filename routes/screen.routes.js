const router = require("express").Router();
const Screen = require("../models/Screen");

router.get("/", async (_, res) => {
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
});

module.exports = router;
