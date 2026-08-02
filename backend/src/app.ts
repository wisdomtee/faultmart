import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./modules/user/user.routes";
import listingRoutes from "./modules/listing/listing.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import vehicleRoutes from "./modules/vehicle";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "FaultMart API is running 🚀",
  });
});

// ✅ Error handler must be LAST
app.use(errorHandler);

export default app;