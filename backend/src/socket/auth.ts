import { Socket } from "socket.io";
import { JwtPayload, verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedSocket extends Socket {
  user?: JwtPayload;
}

export const authenticateSocket = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required."));
    }

    const payload = verifyAccessToken(token);

    socket.user = payload;

    next();
  } catch {
    next(new Error("Invalid or expired token."));
  }
};