import express from "express";
import auth from "../middleware/auth.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:conversationId", auth, getMessages);
router.post("/", auth, sendMessage);


export default router;