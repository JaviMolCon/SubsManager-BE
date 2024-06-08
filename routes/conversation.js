const express = require('express');
const {
	createConversation,
	getConversation,
	getConversationBetweenTwo,
} = require('../controllers/conversationController');

const router = express.Router();

router.post('/', createConversation);
router.get('/:userId', getConversation);
router.get('/:firstUserId/:secondUserId', getConversationBetweenTwo);

module.exports = router;
