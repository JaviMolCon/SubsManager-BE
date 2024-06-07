const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('colors');
const connectDB = require('./dbinit');
const subscription = require('./routes/subscription');
const userRoutes = require('./routes/user');
// const contactRoutes = require('./routes/contact');
const chatMessageRoutes = require('./routes/chatMessage');
const { createMessage } = require('./controllers/chatMessageController');
const Conversation = require('./schemas/Conversation');
const conversationRoute = require('./routes/conversation');
const ChatMessage = require('./schemas/Chat');
const { timeStamp } = require('console');
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:5173', // React app URL
		methods: ['GET', 'POST'],
	},
});

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Welcome to SubsManager API');
});

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/subscriptions', subscription);
app.use('/users', userRoutes);
app.use('/chat', chatMessageRoutes); // Mount chat message routes
// app.use('/contact', contactRoutes);
app.use('/conversation', conversationRoute); // Mount chat message routes

// Socket.io connection handling
io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('sendMessage', async (data) => {
		// console.log('Received message:', data); // Log received message
		try {
			const chatMessage = await createNewMessage(data);
			// console.log('Emitting message:', data); // Log the emitted message
			io.emit('receiveMessage', data);
		} catch (error) {
			console.error('Error saving message:', error);
		}
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
});

// Function to create new messages between two users
const createNewMessage = async (data) => {
	// console.log('my data is:', data);
	try {
		const chatMessage = new ChatMessage({
			sender: data.sender,
			receiver: data.receiver,
			message: data.message,
			conversation: data.conversation,
			timestamp: data.timestamp,
		});
		await chatMessage.save();
	} catch (error) {
		console.error('Error creating message:', error);
	}
};

server.listen(PORT, () => {
	const boldUrl = `http://localhost:${PORT}`.bold;
	console.log(`Server is running on ${boldUrl}`.underline.yellow);
});
