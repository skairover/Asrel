import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export async function createConversation(req, res) {
  try {
    const { recipientId } = req.body;
    const currentUser = req.user.userId;

    if (!recipientId) {
      return res.status(400).json({
        message: "Recipient ID is required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [currentUser, recipientId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUser, recipientId],
      });
    }

    res.status(200).json(conversation);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
export async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate("participants", "name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}