import http from "http";

import app from "./app";
import { env } from "./config/env";
import { initializeSocket } from "./socket";

console.log("JWT ENV CHECK:", {
  accessSecretExists: Boolean(process.env.JWT_ACCESS_SECRET),
  refreshSecretExists: Boolean(process.env.JWT_REFRESH_SECRET),
  accessSecretLength: process.env.JWT_ACCESS_SECRET?.length || 0,
  refreshSecretLength: process.env.JWT_REFRESH_SECRET?.length || 0,
});

const server = http.createServer(app);

initializeSocket(server);

server.listen(env.PORT, () => {
  console.log(`🚀 FaultMart API running on port ${env.PORT}`);
});