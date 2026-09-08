import { Server } from "socket.io";
import { AuthenticatedSocket } from "./auth";

export const registerSocketHandlers = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  console.log(`✅ ${socket.user?.email} connected`);

  socket.join(`user:${socket.user?.userId}`);

  console.log(`Joined room user:${socket.user?.userId}`);

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${socket.user?.email} disconnected`);
  });
};
