import express from "express";
import { uploadCSV } from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();


//router.use(authMiddleware);
//router.use(adminOnly);

router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.post("/upload-csv", upload.single("file"), uploadCSV);

export default router;
