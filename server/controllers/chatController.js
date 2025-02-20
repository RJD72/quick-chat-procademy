const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    const chat = new Chat(req.body);
    const savedChat = await chat.save();

    await savedChat.populate("members");

    res.status(201).send({
      message: "Chat created successfully",
      success: true,
      data: savedChat,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

// Get all chats
router.get("/get-all-chats", authMiddleware, async (req, res) => {
  try {
    // Get all chats that have the currently logged in user's id in the members array(req.body.userId)
    const allChats = await Chat.find({
      members: { $in: req.body.userId },
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.send({
      message: "Chat fetched successfully",
      success: true,
      data: allChats,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/clear-unread-message", authMiddleware, async (req, res) => {
  try {
    const chatId = req.body.chatId;

    // Update the unread message count in chat collection
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.send({
        message: "Chat not found",
        success: false,
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { unreadMessageCount: 0 },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    // Update the read property to true in message collection
    await Message.updateMany(
      {
        chatId: chatId,
        read: false,
      },
      { read: true }
    );

    res.send({
      message: "Unread message count cleared successfully",
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
