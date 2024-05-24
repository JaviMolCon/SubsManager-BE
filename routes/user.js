const express = require("express");

const {
  loginUser,
  signUpUser,
  getAllUsers,
  getUser,
} = require("../controllers/userControllers");

const app = express.Router();

// Login
app.post("/login", loginUser);

// signup
app.post("/signup", signUpUser);

// Get users
app.get("/users", getAllUsers);

app.get("/:id", getUser);

module.exports = app;
