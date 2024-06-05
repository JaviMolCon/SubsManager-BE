const ChatMessage = require("../schemas/Chat");
const User = require("../schemas/User");

// Function to retrieve messages between two users

const createMessage = async (data) => {
  console.log("Saving message:", data); // Log the message data
  const { sender, receiver, message, timestamp } = data;

  // Convert timestamp to a Date object if it's a string
  const timestampDate = new Date(timestamp);
  try {
    const chatMessage = new ChatMessage({
      sender,
      receiver,
      message,
      timestamp: timestampDate,
    });
    const savedMessage = await chatMessage.save();
    console.log("Message saved:", savedMessage); // Log the saved message
    return savedMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
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
