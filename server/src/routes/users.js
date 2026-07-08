import express from "express";
import auth from "../middleware/auth.js";
import { searchUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/search", auth, searchUsers);

export default router;