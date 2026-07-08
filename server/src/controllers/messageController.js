import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export async function getMessages(req, res) {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

export async function sendMessage(req, res) {
  try {
    const { conversationId, text } = req.body;

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.userId,
      text,
    });

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: message._id,
      }
    );

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");
      const io = req.app.get("io");

io.to(conversationId).emit(
  "receive-message",
  populatedMessage
);

    res.status(201).json(populatedMessage);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}