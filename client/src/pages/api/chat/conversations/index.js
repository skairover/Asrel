import {connectDB} from "@/lib/db";
import Conversation from "@/models/Conversation";
import { verifyToken } from "@/utils/auth";
import Message from "@/models/Message";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      return getConversations(req, res);

    case "POST":
      return createConversation(req, res);

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function getConversations(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
    return res.status(401).json({
        message: "Unauthorized",
    });
}


    const conversations = await Conversation.find({
      participants: user.userId,
    })
      .populate("participants", "name avatar isOnline")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createConversation(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
    return res.status(401).json({
        message: "Unauthorized",
    });
    }
    const { participants } = req.body;
    const allParticipants = [...new Set([user.userId, ...(participants || [])])];

if (allParticipants.length < 2) {
  return res.status(400).json({
    message: "Conversation must have at least two participants.",
  });
}
  
    const existingConversation = await Conversation.findOne({
        participants: {
        $all: allParticipants,
        $size: allParticipants.length,
        },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const conversation = await Conversation.create({
      participants: allParticipants,
    });

    return res.status(201).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}