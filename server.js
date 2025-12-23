import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import toolRoutes from "./routes/tool.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.URL || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://www.topaitoolshub.com",
      "https://top-ai-tools-hub.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/Admin", adminRoutes);
app.use("/api/tools", toolRoutes);

app.use("/api/user", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Export for Vercel serverless functions
export default app;

// Only listen when not in serverless environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.URL || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

