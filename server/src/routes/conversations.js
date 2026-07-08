import express from "express";
import auth from "../middleware/auth.js";
import {createConversation, getConversations} from "../controllers/conversationController.js";


const router = express.Router();
router.get("/", auth, getConversations);

router.post("/", auth, createConversation);

export default router;