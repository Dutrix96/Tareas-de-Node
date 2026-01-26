import { Server } from "socket.io";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket desconectado:", socket.id);
    });
  });

  return io;
};