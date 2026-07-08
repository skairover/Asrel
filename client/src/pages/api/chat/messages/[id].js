import {connectDB} from "@/lib/db";
import Message from "@/models/Message";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      return getMessage(req, res);

    case "PATCH":
      return updateMessage(req, res);

    case "DELETE":
      return deleteMessage(req, res);

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function getMessage(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const message = await Message.findById(req.query.id)
      .populate("sender", "username avatar")
      .populate("replyTo");

    if (!message) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateMessage(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const message = await Message.findById(req.query.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }
    const isOwner = message.sender.toString() === user.userId;

    if (!isOwner) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    message.text = req.body.text;
    message.edited = true;

    await message.save();

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteMessage(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const message = await Message.findById(req.query.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }
    const isOwner = message.sender.toString() === user.userId;

    if (!isOwner) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    message.deleted = true;
    message.text = "";
    message.image = null;

    await message.save();

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
