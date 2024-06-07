const express = require('express');
const {
	getMessages,
	createMessage,
	getMessagesFromConversation,
} = require('../controllers/chatMessageController');

const router = express.Router();

router.get('/', getMessages).get('/:conversation', getMessagesFromConversation);
router.post('/', createMessage);

module.exports = router;
