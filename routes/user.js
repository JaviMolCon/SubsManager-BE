const express = require("express");

const {
  loginUser,
  signUpUser,
  getAllUsers,
  getUser,
  updateUser,
  addSub,
  deleteUser,
  getUserSubs,
} = require("../controllers/userControllers");

const app = express.Router();

// Login
app.post("/login", loginUser);

// signup
app.post("/signup", signUpUser);

//Filter users with platformName
app.route("/").get(getUserSubs);

// Get all users
app.route("/all").get(getAllUsers);

//Get one User and Update one user
app.route("/:id").get(getUser).put(updateUser).put(addSub).delete(deleteUser);

module.exports = app;
