import { Server } from "socket.io";

let io: Server;

export const setSocketServer = (server: Server) => {
  io = server;
};

export const getSocketServer = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
};