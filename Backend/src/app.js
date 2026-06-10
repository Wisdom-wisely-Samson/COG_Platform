import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

app.use(morgan("dev"));

app.get("/", (req,res)=>{
    res.json({
        success:true,
        message:"Capital One API Running"
    });
});
import authRoutes
from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

export default app;
import departmentRoutes
from "./routes/departmentRoutes.js";
app.use(
  "/api/v1/departments",
  departmentRoutes
);
import taskRoutes
from "./routes/taskRoutes.js";

app.use(
  "/api/v1/tasks",
  taskRoutes
);
import activityLogRoutes
from "./routes/activityLogRoutes.js";

app.use(
  "/api/v1/activity-logs",
  activityLogRoutes
);
import deliverableRoutes
from "./routes/deliverableRoutes.js";

app.use(
  "/api/v1/deliverables",
  deliverableRoutes
);