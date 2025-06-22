import express from "express";
import { getAllUsers ,deleteUser, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.delete("/:id", verifyToken, deleteUser);       
router.put("/:id", verifyToken, updateUser);          

export default router;
