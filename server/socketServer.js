import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("📡 Novo admin conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("Admin desconectado:", socket.id);
    });
  });

  return io;
};

export const getSocket = () => io;
