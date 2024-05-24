const User = require("../schemas/User");
const Subscription = require("../schemas/Subscription");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRETE, { expiresIn: "1d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.login(email, password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// sign up user
const signUpUser = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);
  try {
    const user = await User.signup(email, password, username);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get ALl Users
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get one User
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate("sharedSubscriptions")
      .populate("subscriptions");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newUser = { email: user.email, username: user.username };
    console.log(newUser);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("Dipali log");
  }
};

module.exports = { loginUser, signUpUser, getAllUsers, getUser };
