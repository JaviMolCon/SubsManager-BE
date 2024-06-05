const express = require("express");
const upload = require("../services/upload");
const {
  loginUser,
  signUpUser,
  getAllUsers,
  getUser,
  updateUser,
  addSub,
  deleteUser,
  getUserSubs,
  updateProfilePic,
} = require("../controllers/userControllers");

const app = express.Router();

// Login
app.post("/login", loginUser);

// signup
app.post("/signup", signUpUser);

//Get all user and filter according to platformName
app.get("/all", async (req, res) => {
  const { platformName } = req.query;
  if (platformName) {
    return getUserSubs(req, res);
  } else {
    return getAllUsers(req, res);
  }
});

//Get one User and Update one user
app.route("/:id").get(getUser).put(updateUser).put(addSub).delete(deleteUser);

//*update Profile Picture
app.put("/:id/profilePic", upload.single("picture"), updateProfilePic);
module.exports = app;
