import serverless from "serverless-http";
import express from "express";

const app = express();

// Simple test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test endpoint working",
  });
});

// Catch-all handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

export default serverless(app);
