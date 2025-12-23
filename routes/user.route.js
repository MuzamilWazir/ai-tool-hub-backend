import express from "express";
import {
  register,
  login,
  GetAllUser,
  DeleteUser,
} from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUsers", GetAllUser);

router.delete("/deleteUser/:id", DeleteUser);
router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
