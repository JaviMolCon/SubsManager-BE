const ChatMessage = require("../schemas/Chat");
const User = require("../schemas/User");

// Function to retrieve messages between two users
const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const chatMessage = new ChatMessage({
      sender: senderId,
      receiver: receiverId,
      message,
    });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).send("Server Error");
  }
};
// Function to retrieve messages between two users
const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const messages = await ChatMessage.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getMessages,
  createMessage,
};
