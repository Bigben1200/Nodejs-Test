import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../Controllers/taskController.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createTask);
router.get("/", authenticateUser, getTasks);
router.get("/:id", authenticateUser, getTaskById);
router.patch("/:id", authenticateUser, updateTask);
router.delete("/:id", authenticateUser, deleteTask);

export default router;
