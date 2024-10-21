import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();
// app.use(express.json()); // Ensure JSON parsing is enabled
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.post("/users", createUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

export default router;
