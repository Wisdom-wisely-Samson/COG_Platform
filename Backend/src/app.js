import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import all routes
import authRoutes from "./routes/authRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import deliverableRoutes from "./routes/deliverableRoutes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Base Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Capital One API Running"
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/activity-logs", activityLogRoutes);
app.use("/api/v1/deliverables", deliverableRoutes);

export default app;