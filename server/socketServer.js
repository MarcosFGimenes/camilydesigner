// server/socketServer.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Permite todas as origens (ajuste conforme necessário)
    },
  });
  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io não inicializado");
  }
  return io;
};