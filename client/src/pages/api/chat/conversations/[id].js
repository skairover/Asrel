import {connectDB} from "@/lib/db";
import Conversation from "@/models/Conversation";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      return getConversation(req, res);

    case "PATCH":
      return updateConversation(req, res);

    case "DELETE":
      return deleteConversation(req, res);

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function getConversation(req, res) {
  try {
    const { id } = req.query;

    const conversation = await Conversation.findById(id)
      .populate("participants", "username avatar isOnline")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "username avatar",
        },
      });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateConversation(req, res) {
  try {
    const { id } = req.query;

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteConversation(req, res) {
  try {
    const { id } = req.query;

    const conversation = await Conversation.findByIdAndDelete(id);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}