const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("colors");
const connectDB = require("./dbinit");

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to SubsManager API");
});

app.listen(PORT, () => {
  const boldUrl = `http://localhost:${PORT}`.bold;
  console.log(`Server is running on ${boldUrl}`.underline.yellow);
});
