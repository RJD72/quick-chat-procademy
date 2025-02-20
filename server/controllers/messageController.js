const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

router.post("/new-message", authMiddleware, async (req, res) => {
  try {
    // Store the message in the db message collection
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    // Update the last message in the chat collection
    const currentChat = await Chat.findOneAndUpdate(
      {
        _id: req.body.chatId,
      },
      { lastMessage: savedMessage._id, $inc: { unreadMessageCount: 1 } }
    );

    res.status(201).send({
      message: "Message sent successfully",
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
  try {
    const allMessages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });

    res.send({
      message: "All messages retrieved successfully",
      success: true,
      data: allMessages,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
