const ChatMessage = require('../schemas/Chat');
const User = require('../schemas/User');
const Subscription = require('../schemas/Subscription');
const Conversation = require('../schemas/Conversation');

// to create new conversation

const createConversation = async (req, res) => {
	try {
		const { members } = req.body;
		const newConversation = new Conversation({
			members,
		});
		await newConversation.save();
		res.status(201).json(newConversation);
	} catch (error) {
		console.error('Error creating message:', error);
		res.status(500).send('Server Error');
	}
};

// to get logged in user conversation
const getConversation = async (req, res) => {
	try {
		const { userId } = req.params;
		const conversation = await Conversation.find({
			members: { $in: [req.params.userId] },
		}).populate('members');
		res.status(200).json(conversation);
	} catch (error) {
		res.status(500).json(error);
	}
};

// get conersation between two users
const getConversationBetweenTwo = async (req, res) => {
	try {
		const { firstUserId, secondUserId } = req.params;
		const conversation = await Conversation.find({
			members: { $all: [firstUserId, secondUserId] },
		});
		res.status(200).json(conversation);
	} catch (error) {
		res.status(500).json(error);
	}
};

module.exports = {
	getConversation,
	createConversation,
	getConversationBetweenTwo,
};
