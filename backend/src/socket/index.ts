import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers";
import { setSocketServer } from "./socket";
import { authenticateSocket } from "./auth";

export const initializeSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  setSocketServer(io);

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket);
  });

  return io;
};