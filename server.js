const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("colors");
const subscription = require("./routes/subscription");
const userRoutes = require("./routes/user");

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to SubsManager API");
});
//form submission
app.use(express.urlencoded({ extended: true }));
app.use("/subscriptions", subscription);

app.use("/user", userRoutes);

app.listen(PORT, () => {
  const boldUrl = `http://localhost:${PORT}`.bold;
  console.log(`Server is running on ${boldUrl}`.underline.yellow);
});
