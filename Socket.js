module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("register-playlist", (playlistId) => {
      socket.join(`playlist-${playlistId}`);
    });

    socket.on("register-screen", (screenId) => {
      socket.join(`screen-${screenId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
