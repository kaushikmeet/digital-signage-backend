const PlaylistItem = require("../models/PlaylistItem");
const Playlist = require("../models/Playlist");

/* ---------------- PLAYLIST ITEMS ---------------- */

exports.createPlaylist = async (req, res) => {
  const playlist = new Playlist(req.body);
  await playlist.save();
  res.json(playlist);
};

exports.getAllPlaylists = async (req, res) => {
  const playlists = await Playlist.find().sort({ createdAt: -1 });
  res.json(playlists);
};

exports.createPlayListItem = async (req, res) => {
  const item = await PlaylistItem.create(req.body);

  const io = req.app.get("io");
  io.to(`playlist-${item.playlistId}`).emit("playlist-updated", {
    playlistId: item.playlistId,
  });

  res.json(item);
};

exports.getPlaylistItems = async (req, res) => {
  const items = await PlaylistItem.find({ playlistId: req.params.id })
    .populate("mediaId")
    .sort({ position: 1 });

  res.json(items);
};

exports.getPlayListItemById = async (req, res) => {
  const item = await PlaylistItem.findById(req.params.id)
    .populate("mediaId");

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json(item);
};

exports.updatePlayListItem = async (req, res) => {
  const item = await PlaylistItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const io = req.app.get("io");
  io.to(`playlist-${item.playlistId}`).emit("playlist-updated", {
    playlistId: item.playlistId,
  });

  res.json(item);
};

exports.deletePlayListItem = async (req, res) => {
  const item = await PlaylistItem.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const io = req.app.get("io");
  io.to(`playlist-${item.playlistId}`).emit("playlist-updated", {
    playlistId: item.playlistId,
  });

  res.json({ message: "Item deleted successfully" });
};

exports.createReorderItems = async (req, res) => {
  const { items } = req.body;

  await Promise.all(
    items.map((item, index) =>
      PlaylistItem.findByIdAndUpdate(item._id, {
        position: index + 1,
      })
    )
  );

  if (items.length > 0) {
    const io = req.app.get("io");
    io.to(`playlist-${items[0].playlistId}`).emit("playlist-updated", {
      playlistId: items[0].playlistId,
    });
  }

  res.json({ message: "Items reordered successfully" });
};

/* ---------------- ACTIVE ITEMS ---------------- */

// exports.ActivePlayListItem = async (req, res) => {
//   const items = await PlaylistItem.find({
//     playlistId: req.params.id
//   }).populate("mediaId");

//   res.json(items);
// };

exports.ActivePlayListItem = async (req, res) => {
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = dayNames[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const items = await PlaylistItem.find({
    playlistId: req.params.id
  }).populate("mediaId");

  const activeItems = items.filter(item => {
    // no schedule → always active
    if (
      item.startTime == null ||
      item.endTime == null ||
      !item.days?.length
    ) {
      return true;
    }

    // ensure correct day format
    if (!item.days.includes(currentDay)) return false;

    // normalize legacy Date → minutes
    const start =
      item.startTime instanceof Date
        ? item.startTime.getHours() * 60 + item.startTime.getMinutes()
        : item.startTime;

    const end =
      item.endTime instanceof Date
        ? item.endTime.getHours() * 60 + item.endTime.getMinutes()
        : item.endTime;

    if (start <= end) {
      return currentMinutes >= start && currentMinutes <= end;
    }

    return currentMinutes >= start || currentMinutes <= end;
  });

  res.json(activeItems);
};


const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

exports.updatePlaylistItemSchedule = async (req, res) => {
  const { days, startTime, endTime } = req.body;

  const item = await PlaylistItem.findByIdAndUpdate(
    req.params.id,
    {
      days,
      startTime: startTime ? toMinutes(startTime) : null,
      endTime: endTime ? toMinutes(endTime) : null
    },
    { new: true }
  );

  res.json(item);
};

