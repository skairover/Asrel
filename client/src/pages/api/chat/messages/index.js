import {connectDB} from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      return getMessages(req, res);

    case "POST":
      return sendMessage(req, res);

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function getMessages(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
    return res.status(401).json({
        message: "Unauthorized",
    });
    }
        const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({
        message: "conversationId is required.",
      });
    }
    const conversation = await Conversation.findById(conversationId);

if (!conversation) {
  return res.status(404).json({
    message: "Conversation not found",
  });
}

const isParticipant = conversation.participants.some(
  (participant) => participant.toString() === user.userId
);

if (!isParticipant) {
  return res.status(403).json({
    message: "Forbidden",
  });
}

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "username avatar")
      .populate("replyTo")
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function sendMessage(req, res) {
  try {
    const {
      conversation,
      text,
      image,
      replyTo,
    } = req.body;
    const user = verifyToken(req);

        if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
        }

    const message = await Message.create({
      conversation,
    sender: user.userId,
      text,
      image,
      replyTo,
    });

    await Conversation.findByIdAndUpdate(conversation, {
      lastMessage: message._id,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name avatar")
      .populate("replyTo");
      const conversationData = await Conversation.findById(conversation)
  .select("participants");

conversationData.participants.forEach((userId) => {
global.io?.to(`user:${userId}`).emit(
  "conversation-updated",
  populatedMessage
);
});

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}