const ChatMessage = require('../schemas/Chat');
const User = require('../schemas/User');
const Subscription = require('../schemas/Subscription');

// Function to retrieve messages between two users
const createMessage = async (req, res) => {
	try {
		const { senderId, receiverId, message, conversation } = req.body;
		const chatMessage = new ChatMessage({
			sender: senderId,
			receiver: receiverId,
			message,
			conversation,
		});
		await chatMessage.save();
		res.status(201).json(chatMessage);
	} catch (error) {
		console.error('Error creating message:', error);
		res.status(500).send('Server Error');
	}
};
// Function to retrieve messages between two users
// const getMessages = async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.query;
//     const messages = await ChatMessage.find({
//       $or: [
//         { sender: senderId, receiver: receiverId },
//         { sender: receiverId, receiver: senderId },
//       ],
//     }).sort({ timestamp: 1 });
//     res.json(messages);
//   } catch (error) {
//     console.error("Error retrieving messages:", error);
//     res.status(500).send("Server Error");
//   }
// };

const getMessages = async (req, res) => {
	try {
		const { userId } = req.query;

		// Fetch all messages involving the logged-in user
		const messages = await ChatMessage.find({
			$or: [{ sender: userId }, { receiver: userId }],
		}).sort({ timestamp: -1 }); // Sort by timestamp descending to get the latest messages first

		// Group messages by conversation partner
		const conversations = {};
		messages.forEach((message) => {
			const partnerId =
				message.sender.toString() === userId
					? message.receiver.toString()
					: message.sender.toString();
			if (!conversations[partnerId]) {
				conversations[partnerId] = [];
			}
			conversations[partnerId].push(message);
		});

		// Convert the conversations object to an array and sort by the latest message timestamp
		const sortedConversations = Object.values(conversations).sort((a, b) => {
			return b[0].timestamp - a[0].timestamp;
		});

		res.json(sortedConversations);
	} catch (error) {
		console.error('Error retrieving conversations:', error);
		res.status(500).send('Server Error');
	}
};

// get all mesages from particular conversation

const getMessagesFromConversation = async (req, res) => {
	try {
		const messages = await ChatMessage.find({
			conversation: req.params.conversation,
		});
		res.status(200).json(messages);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	getMessages,
	createMessage,
	getMessagesFromConversation,
};
