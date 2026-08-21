import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import "./events/notification.listener";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./modules/user/user.routes";
import listingRoutes from "./modules/listing/listing.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import vehicleRoutes from "./modules/vehicle";
import favoriteRoutes from "./modules/favorite/favorite.routes";
import offerRoutes from "./modules/offer/offer.routes";
import conversationRoutes from "./modules/conversation/conversation.routes";
import messageRoutes from "./modules/message/message.routes";
import orderRoutes from "./modules/order/order.routes";
import deliveryRoutes from "./modules/delivery/delivery.routes";
import reviewRoutes from "./modules/review/review.routes";
import reportRoutes from "./modules/report/report.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import { swaggerUi, swaggerSpec } from "./docs/swagger";
import adminRoutes from "./modules/admin/admin.routes";
import auditRoutes from "./modules/audit/audit.routes";
import searchRoutes from "./modules/search/search.routes";
import homeRoutes from "./modules/home/home.routes";
import categoryRoutes from "./modules/category/category.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import careerRoutes from "./modules/career/career.routes";
import aiRoutes from "./modules/ai/ai.routes";

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
app.use("/api/favorites", favoriteRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/audit",auditRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));




app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "FaultMart API is running 🚀",
  });
});

// ✅ Error handler must be LAST
app.use(errorHandler);

export default app;