import { io } from "socket.io-client";

export const crearSocket = () => {
  const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"],
  });
  return socket;
};