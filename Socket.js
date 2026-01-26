const onlineScreens = new Map();
const ProofOfPlay = require("./models/ProofOfPlay");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    /* SCREEN REGISTRATION */
    socket.on("register-screen", (screenId) => {
      socket.join(`screen-${screenId}`);
      console.log("📺 Screen joined:", screenId);
    });

    socket.on("screen-heartbeat", (screenId) => {
      onlineScreens.set(screenId, Date.now());
      // console.log("❤️ Heartbeat from:", screenId);
    });

    socket.on("emergency-push", ({ media }) => {
      io.emit("emergency-media", media);
    });

    /* PLAYER CONTROLS */
    socket.on("player-control", ({ screenId, action }) => {
      console.log("🎮", action, "→", screenId);
      io.to(`screen-${screenId}`).emit("player-control", action);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });

    socket.on("proof-play-start", async (data) => {
    await ProofOfPlay.create({
      screenId: data.screenId,
      playlistId: data.playlistId,
      mediaId: data.mediaId,
      startedAt: data.startedAt
    });
  });

  socket.on("proof-play-end", async (data) => {
    await ProofOfPlay.findOneAndUpdate(
      {
        screenId: data.screenId,
        mediaId: data.mediaId,
        startedAt: data.startedAt
      },
      {
        endedAt: data.endedAt,
        duration: data.duration,
        status: data.status
      }
    );
  });

  });
  
};
