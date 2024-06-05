const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
require("colors");
const connectDB = require("./dbinit");
const subscription = require("./routes/subscription");
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");
const chatMessageRoutes = require("./routes/chatMessage");
const { createMessage } = require("./controllers/chatMessageController");

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to SubsManager API");
});

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/subscriptions", subscription);
app.use("/users", userRoutes);
app.use("/chat", chatMessageRoutes); // Mount chat message routes
app.use("/contact", contactRoutes);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (data) => {
    console.log("Received message:", data); // Log received message
    try {
      const chatMessage = await createMessage(data);
      console.log("Emitting message:", chatMessage); // Log the emitted message
      io.emit("receiveMessage", chatMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  const boldUrl = `http://localhost:${PORT}`.bold;
  console.log(`Server is running on ${boldUrl}`.underline.yellow);
});
