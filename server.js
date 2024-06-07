const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('colors');
const connectDB = require('./dbinit');
const subscription = require('./routes/subscription');
const userRoutes = require('./routes/user');
const chatMessageRoutes = require('./routes/chatMessage');
const { saveMessage } = require('./controllers/chatMessageController');
const Conversation = require('./schemas/Conversation');
const conversationRoute = require('./routes/conversation');

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
app.use('/conversation', conversationRoute); // Mount chat message routes

// Socket.io connection handling
io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('sendMessage', async (data) => {
		try {
			const chatMessage = await saveMessage(data);
			io.emit('receiveMessage', chatMessage); // Broadcast the message to all connected clients
		} catch (error) {
			console.error('Error saving message:', error);
		}
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
});

server.listen(PORT, () => {
	const boldUrl = `http://localhost:${PORT}`.bold;
	console.log(`Server is running on ${boldUrl}`.underline.yellow);
});
