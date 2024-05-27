const express = require("express");

const {
  loginUser,
  signUpUser,
  getAllUsers,
  getUser,
  updateUser,
  addSub,
  deleteUser,
} = require("../controllers/userControllers");

const app = express.Router();

// Login
app.post("/login", loginUser);

// signup
app.post("/signup", signUpUser);

// Get users
app.get("/all", getAllUsers);

//Get one User and Update one user
app.route("/:id").get(getUser).put(updateUser).put(addSub).delete(deleteUser);

module.exports = app;
