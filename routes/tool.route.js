import {
  AddTool,
  UpdateTool,
  DeleteTool,
  GetAllTools,
  GetToolById,
  GetAllToolsActive,
} from "../controllers/tools.controller.js";
import express from "express";
import adminOnly from "../middleware/role.middleware.js";
const router = express.Router();

router.post("/AddTools", AddTool);
router.patch("/update/:id", adminOnly, UpdateTool);
router.delete("/DeleteTool/:id", DeleteTool);
router.get("/GetAllTools", GetAllTools);
router.get("/GetToolById/:id", GetToolById);
router.get("/ActiveTools", GetAllToolsActive);

export default router;
